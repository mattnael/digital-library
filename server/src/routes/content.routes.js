import { Router } from 'express';
import path from 'node:path';
import { pool } from '../db.js';
import { config } from '../config.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { writeAudit } from '../middleware/audit.js';
import { upload } from '../middleware/upload.js';
import { HttpError } from '../middleware/errors.js';
import { contentSchema, contentListQuerySchema, parseQuery } from '../schemas.js';
import { toContent, formatBytes } from '../services/content.service.js';
import { isStoredFileName, removeStoredFile } from '../services/storage.service.js';
import { likePattern } from '../utils.js';

const router = Router();

const VIEW_DETAIL_BY_TYPE = {
  'E-book': 'Membuka halaman detail e-book',
  'Research Paper': 'Membuka halaman detail research paper',
  'Video YouTube': 'Membuka halaman video YouTube',
};

// The root option of res.sendFile is bound to this directory once; express
// rejects any requested path that escapes it.
const uploadsRoot = path.resolve(config.upload.dir);

async function assertCategoriesExist(courseId, genreId) {
  if (courseId) {
    const exists = await pool.query('SELECT 1 FROM courses WHERE id = $1', [courseId]);
    if (exists.rowCount === 0) {
      throw new HttpError(400, 'VALIDATION_ERROR', 'Mata kuliah tidak ditemukan.');
    }
  }
  if (genreId) {
    const exists = await pool.query('SELECT 1 FROM genres WHERE id = $1', [genreId]);
    if (exists.rowCount === 0) {
      throw new HttpError(400, 'VALIDATION_ERROR', 'Genre tidak ditemukan.');
    }
  }
}

router.get('/contents', requireAuth, async (req, res) => {
  const parsed = parseQuery(contentListQuerySchema, req.query);
  if (parsed.error) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Filter tidak valid.', parsed.error.map((message) => ({ message })));
  }

  const { search, type, courseId, genreId, page, limit, includeInactive } = parsed.data;
  // Semua filter lewat parameter fungsi; NULL berarti filter tidak aktif.
  const result = await pool.query(
    'SELECT * FROM list_contents($1, $2, $3, $4, $5, $6, $7)',
    [
      req.user.role === 'ADMIN' && includeInactive,
      likePattern(search),
      type || null,
      courseId || null,
      genreId || null,
      limit,
      (page - 1) * limit,
    ],
  );

  const rows = result.rows;
  const total = Number(rows[0]?.total_count ?? 0);
  res.json({
    data: rows.map(toContent),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});

router.get('/contents/:id', requireAuth, async (req, res) => {
  const detail = await pool.query(
    `SELECT c.*, co.nama AS course_nama, co.kode AS course_kode, g.nama AS genre_nama
     FROM contents c
     LEFT JOIN courses co ON co.id = c.course_id
     LEFT JOIN genres g ON g.id = c.genre_id
     WHERE c.id = $1`,
    [req.params.id],
  );
  const row = detail.rows[0];
  if (!row || (!row.is_active && req.user.role !== 'ADMIN')) {
    throw new HttpError(404, 'NOT_FOUND', 'Konten tidak ditemukan.');
  }

  pool.query('UPDATE contents SET view_count = view_count + 1 WHERE id = $1', [row.id])
    .catch((err) => req.log?.error({ err }, 'Gagal menambah view count'));

  writeAudit(req, {
    action: 'VIEW',
    contentId: row.id,
    contentTitle: row.title,
    detail: VIEW_DETAIL_BY_TYPE[row.content_type],
  });

  res.json({ content: toContent(row) });
});

router.post(
  '/contents',
  requireAuth,
  requireAdmin,
  upload.single('file'),
  validate(contentSchema),
  async (req, res) => {
    const data = req.validated;
    const isDocument = data.contentType === 'E-book' || data.contentType === 'Research Paper';

    if (isDocument && !req.file) {
      throw new HttpError(400, 'FILE_REQUIRED', 'Berkas PDF/EPUB wajib diunggah untuk jenis konten ini.');
    }
    if (data.contentType === 'Video YouTube' && !data.youtubeUrl) {
      throw new HttpError(400, 'URL_REQUIRED', 'URL YouTube wajib diisi untuk video.');
    }
    await assertCategoriesExist(data.courseId, data.genreId);

    try {
      const inserted = await pool.query(
        `INSERT INTO contents
           (title, content_type, author, isbn, language, publisher,
            publish_year, total_pages, duration_minutes, description,
            youtube_url, file_path, file_name, file_size, file_format,
            course_id, genre_id, created_by, edition)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
         RETURNING id`,
        [
          data.title,
          data.contentType,
          data.author,
          data.isbn,
          data.language,
          data.publisher,
          data.publishYear,
          data.totalPages,
          data.durationMinutes,
          data.description,
          data.youtubeUrl,
          req.file ? req.file.filename : null,
          req.file ? req.file.originalname : null,
          req.file ? req.file.size : null,
          req.file ? path.extname(req.file.filename) : null,
          data.courseId,
          data.genreId,
          req.user.id,
          data.edition,
        ],
      );

      const detail =
        data.contentType === 'Video YouTube'
          ? 'Video YouTube baru ditambahkan'
          : `Berkas ${req.file.originalname} (${formatBytes(req.file.size)}) diunggah`;
      writeAudit(req, { action: 'CREATE', contentId: inserted.rows[0].id, contentTitle: data.title, detail });

      const full = await pool.query(
        `SELECT c.*, co.nama AS course_nama, co.kode AS course_kode, g.nama AS genre_nama
         FROM contents c
         LEFT JOIN courses co ON co.id = c.course_id
         LEFT JOIN genres g ON g.id = c.genre_id
         WHERE c.id = $1`,
        [inserted.rows[0].id],
      );
      res.status(201).json({ content: toContent(full.rows[0]) });
    } catch (err) {
      if (req.file) {
        await removeStoredFile(req.file.filename).catch(() => {});
      }
      throw err;
    }
  },
);

router.put(
  '/contents/:id',
  requireAuth,
  requireAdmin,
  upload.single('file'),
  validate(contentSchema),
  async (req, res) => {
    const data = req.validated;
    const existingResult = await pool.query(
      `SELECT c.*, co.nama AS course_nama, co.kode AS course_kode, g.nama AS genre_nama
       FROM contents c
       LEFT JOIN courses co ON co.id = c.course_id
       LEFT JOIN genres g ON g.id = c.genre_id
       WHERE c.id = $1`,
      [req.params.id],
    );
    const existing = existingResult.rows[0];
    if (!existing) {
      throw new HttpError(404, 'NOT_FOUND', 'Konten tidak ditemukan.');
    }

    const isDocument = data.contentType === 'E-book' || data.contentType === 'Research Paper';
    if (isDocument && !existing.file_path && !req.file) {
      throw new HttpError(400, 'FILE_REQUIRED', 'Berkas PDF/EPUB wajib diunggah untuk jenis konten ini.');
    }
    if (data.contentType === 'Video YouTube' && !data.youtubeUrl) {
      throw new HttpError(400, 'URL_REQUIRED', 'URL YouTube wajib diisi untuk video.');
    }
    await assertCategoriesExist(data.courseId, data.genreId);

    let updated;
    if (req.file) {
      updated = await pool.query(
        `UPDATE contents SET
           title = $2, content_type = $3, author = $4, isbn = $5,
           language = $6, publisher = $7, publish_year = $8,
           total_pages = $9, duration_minutes = $10, description = $11,
           youtube_url = $12, file_path = $13, file_name = $14,
           file_size = $15, file_format = $16,
           course_id = $17, genre_id = $18, edition = $19, updated_at = now()
         WHERE id = $1
         RETURNING title`,
        [
          req.params.id,
          data.title,
          data.contentType,
          data.author,
          data.isbn,
          data.language,
          data.publisher,
          data.publishYear,
          data.totalPages,
          data.durationMinutes,
          data.description,
          data.youtubeUrl,
          req.file.filename,
          req.file.originalname,
          req.file.size,
          path.extname(req.file.filename),
          data.courseId,
          data.genreId,
          data.edition,
        ],
      );
    } else {
      updated = await pool.query(
        `UPDATE contents SET
           title = $2, content_type = $3, author = $4, isbn = $5,
           language = $6, publisher = $7, publish_year = $8,
           total_pages = $9, duration_minutes = $10, description = $11,
           youtube_url = $12, course_id = $13, genre_id = $14, edition = $15,
           updated_at = now()
         WHERE id = $1
         RETURNING title`,
        [
          req.params.id,
          data.title,
          data.contentType,
          data.author,
          data.isbn,
          data.language,
          data.publisher,
          data.publishYear,
          data.totalPages,
          data.durationMinutes,
          data.description,
          data.youtubeUrl,
          data.courseId,
          data.genreId,
          data.edition,
        ],
      );
    }

    const changedFields = Object.keys(data).filter(
      (key) => data[key] !== null && existing[key] !== data[key],
    );
    const detail = req.file
      ? `Metadata diperbarui dan berkas diganti dengan ${req.file.originalname}`
      : changedFields.length > 0
        ? `Field diperbarui: ${changedFields.join(', ')}`
        : 'Perubahan disimpan tanpa perbedaan data';
    writeAudit(req, {
      action: 'UPDATE',
      contentId: req.params.id,
      contentTitle: updated.rows[0].title,
      detail,
    });

    if (req.file && existing.file_path) {
      await removeStoredFile(existing.file_path).catch(() => {});
    }

    const full = await pool.query(
      `SELECT c.*, co.nama AS course_nama, co.kode AS course_kode, g.nama AS genre_nama
       FROM contents c
       LEFT JOIN courses co ON co.id = c.course_id
       LEFT JOIN genres g ON g.id = c.genre_id
       WHERE c.id = $1`,
      [req.params.id],
    );
    res.json({ content: toContent(full.rows[0]) });
  },
);

// Pasangan soft delete: mengembalikan konten nonaktif ke katalog.
router.put('/contents/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const isActive = req.body?.isActive;
  if (typeof isActive !== 'boolean') {
    throw new HttpError(400, 'VALIDATION_ERROR', 'isActive harus berupa boolean.');
  }

  const { rows } = await pool.query(
    'UPDATE contents SET is_active = $2, updated_at = now() WHERE id = $1 RETURNING title, is_active',
    [req.params.id, isActive],
  );
  if (!rows[0]) {
    throw new HttpError(404, 'NOT_FOUND', 'Konten tidak ditemukan.');
  }

  writeAudit(req, {
    action: 'UPDATE',
    contentId: req.params.id,
    contentTitle: rows[0].title,
    detail: isActive ? 'Konten diaktifkan kembali' : 'Konten dinonaktifkan',
  });
  res.json({
    message: isActive ? 'Konten diaktifkan kembali.' : 'Konten dinonaktifkan.',
    isActive: rows[0].is_active,
  });
});

router.delete('/contents/:id', requireAuth, requireAdmin, async (req, res) => {
  const { rows } = await pool.query(
    'UPDATE contents SET is_active = FALSE, updated_at = now() WHERE id = $1 RETURNING title',
    [req.params.id],
  );
  if (!rows[0]) {
    throw new HttpError(404, 'NOT_FOUND', 'Konten tidak ditemukan.');
  }
  writeAudit(req, {
    action: 'DELETE',
    contentId: req.params.id,
    contentTitle: rows[0].title,
    detail: 'Soft delete; is_active: false',
  });
  res.json({ message: 'Konten dinonaktifkan dan disembunyikan dari katalog.' });
});

router.get('/contents/:id/file', requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, title, file_path, file_name, file_format FROM contents WHERE id = $1',
    [req.params.id],
  );
  const row = rows[0];
  if (!row || !row.file_path) {
    throw new HttpError(404, 'FILE_NOT_FOUND', 'Berkas tidak tersedia untuk konten ini.');
  }
  if (!isStoredFileName(row.file_path)) {
    throw new HttpError(500, 'FILE_INVALID', 'Berkas tersimpan tidak valid.');
  }

  writeAudit(req, {
    action: 'VIEW',
    contentId: row.id,
    contentTitle: row.title,
    detail: `Membuka berkas ${(row.file_format || '').replace('.', '').toUpperCase()}`,
  });

  const isEpub = row.file_format === '.epub';
  res.setHeader('Content-Type', isEpub ? 'application/epub+zip' : 'application/pdf');
  // Fixed content type plus nosniff: an uploaded file can never come back as
  // text/html, which closes the stored-XSS route through uploads.
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader(
    'Content-Disposition',
    `${isEpub ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(row.file_name || 'dokumen')}`,
  );
  res.sendFile(row.file_path, { root: uploadsRoot });
});

export default router;
