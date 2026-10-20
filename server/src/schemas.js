import { z } from 'zod';

export const CONTENT_TYPES = ['E-book', 'Research Paper', 'Video YouTube'];
export const AUDIT_ACTIONS = ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'REGISTER'];

const YOUTUBE_PATTERNS = [
  /^https?:\/\/(www\.)?youtube\.com\/watch\?v=([\w-]{11})/,
  /^https?:\/\/youtu\.be\/([\w-]{11})/,
];

export function extractYouTubeId(url) {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern);
    if (match) {
      // Pola watch?v= punya dua grup, pola youtu.be satu.
      return match[2] ?? match[1];
    }
  }
  return null;
}

// Multipart forms deliver every field as a string, and JSON clients may send
// null, so empties are normalized to undefined before any coercion happens.
const emptyToUndefined = (value) => (value === '' || value === null ? undefined : value);

const optionalText = (max, message) =>
  z.preprocess(
    emptyToUndefined,
    z.string().trim().max(max, message).optional().transform((v) => v ?? null),
  );

const optionalInt = (min, max) =>
  z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(min, `Minimal ${min}.`).max(max, `Maksimal ${max}.`).optional()
      .transform((v) => v ?? null),
  );

const optionalId = z.preprocess(
  emptyToUndefined,
  z.string().uuid('ID tidak valid.').optional().transform((v) => v ?? null),
);

const optionalYouTube = z.preprocess(
  emptyToUndefined,
  z.string().trim().url('URL YouTube tidak valid.').max(255).optional()
    .refine((v) => v == null || extractYouTubeId(v) !== null, 'URL harus milik video YouTube.')
    .transform((v) => v ?? null),
);

export const registerSchema = z.object({
  fullName: z.string().trim().min(3, 'Nama lengkap minimal 3 karakter.').max(120),
  email: z.string().trim().toLowerCase().email('Format email tidak valid.').max(180),
  // Same rule the register form shows: 8+ characters, letters and digits.
  password: z
    .string()
    .min(8, 'Kata sandi minimal 8 karakter.')
    .max(72)
    .regex(/[A-Za-z]/, 'Kata sandi harus memuat huruf.')
    .regex(/\d/, 'Kata sandi harus memuat angka.'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Format email tidak valid.'),
  password: z.string().min(1, 'Kata sandi wajib diisi.').max(72),
  // The login page has a Pengguna/Admin toggle; the account decides the truth.
  asAdmin: z.preprocess((v) => v === 'true' || v === true, z.boolean()).default(false),
});

export const courseSchema = z.object({
  kode: z.string().trim().min(1, 'Kode mata kuliah wajib diisi.').max(20),
  nama: z.string().trim().min(1, 'Nama mata kuliah wajib diisi.').max(120),
});

export const genreSchema = z.object({
  nama: z.string().trim().min(1, 'Nama genre wajib diisi.').max(80),
  contentType: z.enum(CONTENT_TYPES),
});

export const contentSchema = z.object({
  title: z.string().trim().min(3, 'Judul minimal 3 karakter.').max(200),
  contentType: z.enum(CONTENT_TYPES),
  author: z.string().trim().min(2, 'Penulis minimal 2 karakter.').max(160),
  isbn: optionalText(20, 'ISBN maksimal 20 karakter.'),
  language: optionalText(30, 'Bahasa maksimal 30 karakter.'),
  publisher: optionalText(120, 'Penerbit maksimal 120 karakter.'),
  edition: optionalText(60, 'Edisi maksimal 60 karakter.'),
  publishYear: optionalInt(1400, 2100),
  totalPages: optionalInt(1, 100000),
  durationMinutes: optionalInt(1, 2000),
  description: optionalText(5000, 'Deskripsi maksimal 5000 karakter.'),
  youtubeUrl: optionalYouTube,
  courseId: optionalId,
  genreId: optionalId,
});

export const contentUpdateSchema = contentSchema.partial();

export const contentListQuerySchema = z.object({
  search: z.preprocess(emptyToUndefined, z.string().trim().max(120).optional()),
  type: z.preprocess(emptyToUndefined, z.enum(CONTENT_TYPES).optional()),
  courseId: z.preprocess(emptyToUndefined, z.string().uuid().optional()),
  genreId: z.preprocess(emptyToUndefined, z.string().uuid().optional()),
  page: z.preprocess((v) => v ?? 1, z.coerce.number().int().min(1)),
  limit: z.preprocess((v) => v ?? 12, z.coerce.number().int().min(1).max(50)),
  includeInactive: z.preprocess(
    (v) => v === 'true' || v === true,
    z.boolean().optional().default(false),
  ),
});

export const activityLogQuerySchema = z.object({
  from: z.preprocess(emptyToUndefined, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal: YYYY-MM-DD.').optional()),
  to: z.preprocess(emptyToUndefined, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal: YYYY-MM-DD.').optional()),
  action: z.preprocess(emptyToUndefined, z.enum(AUDIT_ACTIONS).optional()),
  userId: z.preprocess(emptyToUndefined, z.string().uuid().optional()),
  page: z.preprocess((v) => v ?? 1, z.coerce.number().int().min(1)),
  limit: z.preprocess((v) => v ?? 10, z.coerce.number().int().min(1).max(100)),
});

export function parseQuery(schema, rawQuery) {
  const result = schema.safeParse(rawQuery);
  if (!result.success) {
    return { error: result.error.issues.map((issue) => issue.message) };
  }
  return { data: result.data };
}
