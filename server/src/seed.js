import { randomUUID } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { pool } from './db.js';
import { config } from './config.js';
import { logger } from './logger.js';
import { buildSamplePdf } from './samplePdf.js';

// Metadata entri contoh memakai karya nyata yang katalognya dapat diverifikasi
// (pengarang, penerbit, tahun, ISBN); berkas PDF yang dilampirkan jelas
// ditandai sebagai dokumen contoh hasil generator, bukan dokumen aslinya.
const COURSES = [
  { kode: 'IMK01', nama: 'Interaksi Manusia & Komputer' },
  { kode: 'SD02', nama: 'Sains Data' },
  { kode: 'PTI03', nama: 'Pengantar Teknologi Informasi' },
];

const GENRES = [
  { nama: 'Teknologi', contentType: 'E-book' },
  { nama: 'Desain', contentType: 'E-book' },
  { nama: 'Penelitian', contentType: 'Research Paper' },
  { nama: 'Tutorial', contentType: 'Video YouTube' },
];

const EBOOKS = [
  {
    title: 'Structure and Interpretation of Computer Programs',
    author: 'Harold Abelson, Gerald Jay Sussman',
    isbn: '9780262510875',
    publisher: 'MIT Press',
    publishYear: 1996,
    edition: 'Edisi ke-2',
    language: 'English',
    courseKode: 'PTI03',
    genreNama: 'Teknologi',
    description:
      'Buku teks klasik pemrograman komputer dari MIT. Entri contoh: berkas PDF terlampir adalah dokumen contoh hasil generator, bukan buku aslinya.',
  },
  {
    title: 'The Design of Everyday Things (Revised Edition)',
    author: 'Don Norman',
    isbn: '9780465050659',
    publisher: 'Basic Books',
    publishYear: 2013,
    edition: 'Edisi revisi',
    language: 'English',
    courseKode: 'IMK01',
    genreNama: 'Desain',
    description:
      'Dasar-dasar desain dan usabilitas produk sehari-hari. Entri contoh: berkas PDF terlampir adalah dokumen contoh hasil generator.',
  },
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    publisher: 'Prentice Hall',
    publishYear: 2008,
    edition: null,
    language: 'English',
    courseKode: 'PTI03',
    genreNama: 'Teknologi',
    description:
      'Prinsip menulis kode yang mudah dibaca dan dirawat. Entri contoh: berkas PDF terlampir adalah dokumen contoh hasil generator.',
  },
];

const PAPERS = [
  {
    title: 'A Mathematical Theory of Communication',
    author: 'Claude E. Shannon',
    publisher: 'Bell System Technical Journal',
    publishYear: 1948,
    language: 'English',
    courseKode: 'SD02',
    genreNama: 'Penelitian',
    description:
      'Makalah fondasi teori informasi. Entri contoh: berkas PDF terlampir adalah dokumen contoh hasil generator, bukan makalah aslinya.',
  },
  {
    title: 'Attention Is All You Need',
    author: 'Ashish Vaswani, Noam Shazeer, dkk.',
    publisher: 'NeurIPS',
    publishYear: 2017,
    language: 'English',
    courseKode: 'SD02',
    genreNama: 'Penelitian',
    description:
      'Makalah yang memperkenalkan arsitektur Transformer. Entri contoh: berkas PDF terlampir adalah dokumen contoh hasil generator.',
  },
];

// URL video asli dan stabil, masing-masing dapat diverifikasi di YouTube.
const VIDEOS = [
  {
    title: 'Learn Python - Full Course for Beginners',
    author: 'freeCodeCamp.org',
    youtubeUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
    durationMinutes: 289,
    courseKode: 'PTI03',
    genreNama: 'Tutorial',
    description: 'Kursus Python untuk pemula dari channel freeCodeCamp.org.',
  },
  {
    title: 'CS50x 2024 - Lecture 0 - Scratch',
    author: 'Harvard CS50',
    youtubeUrl: 'https://www.youtube.com/watch?v=3LPJfIKxwWc',
    durationMinutes: 97,
    courseKode: 'PTI03',
    genreNama: 'Tutorial',
    description: 'Kuliah pembuka CS50 tahun 2024: dasar berpikir komputasional dengan Scratch.',
  },
  {
    title: 'Learn JavaScript - Full Course for Beginners',
    author: 'freeCodeCamp.org',
    youtubeUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
    durationMinutes: 211,
    courseKode: 'PTI03',
    genreNama: 'Tutorial',
    description: 'Kursus JavaScript untuk pemula dari channel freeCodeCamp.org.',
  },
];

async function storeSamplePdf(title) {
  const fileName = `${randomUUID()}.pdf`;
  const pdf = buildSamplePdf(title, [
    'Dokumen contoh yang dihasilkan otomatis oleh server',
    'perpustakaan digital untuk keperluan demo katalog.',
    '',
    `Judul entri: ${title}`,
    '',
    'Berkas ini bukan dokumen asli dari karya berjudul sama.',
    'Ganti melalui panel admin (Manage Content > Edit) jika',
    'ingin memakai berkas sebenarnya.',
  ]);
  writeFileSync(path.join(config.upload.dir, fileName), pdf);
  return { fileName, size: pdf.length };
}

export async function runSeed() {
  // Migrasi ringan idempoten: volume database lama dibuat sebelum kolom ini ada.
  await pool.query('ALTER TABLE contents ADD COLUMN IF NOT EXISTS edition VARCHAR(60)');

  // Backfill edisi untuk baris seed yang dibuat sebelum kolom ini ada.
  await pool.query(
    'UPDATE contents SET edition = $1 WHERE title = $2 AND edition IS NULL',
    ['Edisi ke-2', 'Structure and Interpretation of Computer Programs'],
  );
  await pool.query(
    'UPDATE contents SET edition = $1 WHERE title = $2 AND edition IS NULL',
    ['Edisi revisi', 'The Design of Everyday Things (Revised Edition)'],
  );

  const existing = await pool.query('SELECT COUNT(*)::int AS total FROM users');
  if (existing.rows[0].total > 0) {
    return;
  }

  logger.info('Database kosong, menjalankan seed awal');

  const passwordHash = await bcrypt.hash(config.seed.adminPassword, 12);
  await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, 'ADMIN')`,
    [config.seed.adminName, config.seed.adminEmail, passwordHash],
  );
  await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ('Mahasiswa Demo', 'mahasiswa@kampus.ac.id', $1, 'USER')`,
    [passwordHash],
  );

  for (const course of COURSES) {
    await pool.query('INSERT INTO courses (kode, nama) VALUES ($1, $2)', [course.kode, course.nama]);
  }
  for (const genre of GENRES) {
    await pool.query('INSERT INTO genres (nama, content_type) VALUES ($1, $2)', [genre.nama, genre.contentType]);
  }

  const courseRows = await pool.query('SELECT id, kode FROM courses');
  const genreRows = await pool.query('SELECT id, nama, content_type FROM genres');
  const courseByKode = new Map(courseRows.rows.map((row) => [row.kode, row.id]));
  const genreByKey = new Map(genreRows.rows.map((row) => [`${row.nama}|${row.content_type}`, row.id]));

  for (const book of EBOOKS) {
    const stored = await storeSamplePdf(book.title);
    await pool.query(
      `INSERT INTO contents
         (title, content_type, author, isbn, language, publisher, edition,
          publish_year, description, file_path, file_name, file_size,
          file_format, course_id, genre_id)
       VALUES ($1, 'E-book', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, '.pdf', $12, $13)`,
      [
        book.title,
        book.author,
        book.isbn,
        book.language,
        book.publisher,
        book.edition,
        book.publishYear,
        book.description,
        stored.fileName,
        `${book.title}.pdf`,
        stored.size,
        courseByKode.get(book.courseKode),
        genreByKey.get(`${book.genreNama}|E-book`),
      ],
    );
  }

  for (const paper of PAPERS) {
    const stored = await storeSamplePdf(paper.title);
    await pool.query(
      `INSERT INTO contents
         (title, content_type, author, language, publisher, publish_year,
          description, file_path, file_name, file_size, file_format,
          course_id, genre_id)
       VALUES ($1, 'Research Paper', $2, $3, $4, $5, $6, $7, $8, $9, '.pdf', $10, $11)`,
      [
        paper.title,
        paper.author,
        paper.language,
        paper.publisher,
        paper.publishYear,
        paper.description,
        stored.fileName,
        `${paper.title}.pdf`,
        stored.size,
        courseByKode.get(paper.courseKode),
        genreByKey.get(`${paper.genreNama}|Research Paper`),
      ],
    );
  }

  for (const video of VIDEOS) {
    await pool.query(
      `INSERT INTO contents
         (title, content_type, author, duration_minutes, description,
          youtube_url, course_id, genre_id)
       VALUES ($1, 'Video YouTube', $2, $3, $4, $5, $6, $7)`,
      [
        video.title,
        video.author,
        video.durationMinutes,
        video.description,
        video.youtubeUrl,
        courseByKode.get(video.courseKode),
        genreByKey.get(`${video.genreNama}|Video YouTube`),
      ],
    );
  }

  logger.info({ adminEmail: config.seed.adminEmail }, 'Seed selesai');
}
