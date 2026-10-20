import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { writeAudit } from '../middleware/audit.js';
import { HttpError } from '../middleware/errors.js';
import { courseSchema, genreSchema } from '../schemas.js';

// CRUD kategori dipisah dari endpoint gabungan supaya bisa di-mount di dua
// path: /api/... (dipakai frontend) dan /api/categories/... (kontrak handoff).
const listRouter = Router();
const crudRouter = Router();

listRouter.get('/categories', requireAuth, async (_req, res) => {
  const courses = await pool.query(
    'SELECT id, kode, nama FROM courses WHERE is_active ORDER BY nama',
  );
  const genres = await pool.query(
    'SELECT id, nama, content_type FROM genres WHERE is_active ORDER BY nama',
  );
  res.json({
    courses: courses.rows.map((row) => ({ id: row.id, kode: row.kode, nama: row.nama })),
    genres: genres.rows.map((row) => ({ id: row.id, nama: row.nama, contentType: row.content_type })),
  });
});

async function countContentsUsingCourse(id) {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS count FROM contents WHERE course_id = $1',
    [id],
  );
  return rows[0].count;
}

async function countContentsUsingGenre(id) {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS count FROM contents WHERE genre_id = $1',
    [id],
  );
  return rows[0].count;
}

crudRouter.get('/courses', requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT id, kode, nama FROM courses WHERE is_active ORDER BY nama',
  );
  res.json({ data: rows });
});

crudRouter.get('/genres', requireAuth, async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT id, nama, content_type FROM genres WHERE is_active ORDER BY nama',
  );
  res.json({
    data: rows.map((row) => ({ id: row.id, nama: row.nama, contentType: row.content_type })),
  });
});

crudRouter.post('/courses', requireAuth, requireAdmin, validate(courseSchema), async (req, res) => {
  const { kode, nama } = req.validated;
  const { rows } = await pool.query(
    'INSERT INTO courses (kode, nama) VALUES ($1, $2) RETURNING id, kode, nama',
    [kode, nama],
  );
  writeAudit(req, { action: 'CREATE', contentTitle: nama, detail: `Mata kuliah baru: ${kode}` });
  res.status(201).json({ course: rows[0] });
});

crudRouter.put('/courses/:id', requireAuth, requireAdmin, validate(courseSchema), async (req, res) => {
  const { kode, nama } = req.validated;
  const { rows } = await pool.query(
    'UPDATE courses SET kode = $2, nama = $3, updated_at = now() WHERE id = $1 RETURNING id, kode, nama',
    [req.params.id, kode, nama],
  );
  if (!rows[0]) {
    throw new HttpError(404, 'NOT_FOUND', 'Mata kuliah tidak ditemukan.');
  }
  writeAudit(req, {
    action: 'UPDATE',
    contentTitle: nama,
    detail: `Mata kuliah diperbarui menjadi ${kode} / ${nama}`,
  });
  res.json({ course: rows[0] });
});

crudRouter.delete('/courses/:id', requireAuth, requireAdmin, async (req, res) => {
  const inUse = await countContentsUsingCourse(req.params.id);
  if (inUse > 0) {
    throw new HttpError(409, 'IN_USE', `Mata kuliah masih dipakai ${inUse} konten dan tidak bisa dihapus.`);
  }
  const { rows } = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING kode, nama', [req.params.id]);
  if (!rows[0]) {
    throw new HttpError(404, 'NOT_FOUND', 'Mata kuliah tidak ditemukan.');
  }
  writeAudit(req, {
    action: 'DELETE',
    contentTitle: rows[0].nama,
    detail: `Mata kuliah ${rows[0].kode} dihapus`,
  });
  res.status(204).send();
});

crudRouter.post('/genres', requireAuth, requireAdmin, validate(genreSchema), async (req, res) => {
  const { nama, contentType } = req.validated;
  const { rows } = await pool.query(
    'INSERT INTO genres (nama, content_type) VALUES ($1, $2) RETURNING id, nama, content_type',
    [nama, contentType],
  );
  writeAudit(req, {
    action: 'CREATE',
    contentTitle: nama,
    detail: `Genre baru untuk ${contentType}`,
  });
  res.status(201).json({ genre: { id: rows[0].id, nama: rows[0].nama, contentType: rows[0].content_type } });
});

crudRouter.put('/genres/:id', requireAuth, requireAdmin, validate(genreSchema), async (req, res) => {
  const { nama, contentType } = req.validated;
  const { rows } = await pool.query(
    'UPDATE genres SET nama = $2, content_type = $3, updated_at = now() WHERE id = $1 RETURNING id, nama, content_type',
    [req.params.id, nama, contentType],
  );
  if (!rows[0]) {
    throw new HttpError(404, 'NOT_FOUND', 'Genre tidak ditemukan.');
  }
  writeAudit(req, {
    action: 'UPDATE',
    contentTitle: nama,
    detail: `Genre diperbarui menjadi ${nama} (${contentType})`,
  });
  res.json({ genre: { id: rows[0].id, nama: rows[0].nama, contentType: rows[0].content_type } });
});

crudRouter.delete('/genres/:id', requireAuth, requireAdmin, async (req, res) => {
  const inUse = await countContentsUsingGenre(req.params.id);
  if (inUse > 0) {
    throw new HttpError(409, 'IN_USE', `Genre masih dipakai ${inUse} konten dan tidak bisa dihapus.`);
  }
  const { rows } = await pool.query('DELETE FROM genres WHERE id = $1 RETURNING nama', [req.params.id]);
  if (!rows[0]) {
    throw new HttpError(404, 'NOT_FOUND', 'Genre tidak ditemukan.');
  }
  writeAudit(req, { action: 'DELETE', contentTitle: rows[0].nama, detail: 'Genre dihapus' });
  res.status(204).send();
});

export { listRouter as categoryListRouter, crudRouter as categoryCrudRouter };
