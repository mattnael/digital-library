import { randomBytes } from 'node:crypto';

const isProd = process.env.NODE_ENV === 'production';

// String kosong dari .env diperlakukan sama dengan tidak diisi, supaya
// menyalin .env.example yang masih kosong selalu gagal cepat, bukan jalan
// dengan nilai aneh.
function read(name) {
  const value = process.env[name];
  return value === '' || value === undefined ? undefined : value;
}

function required(name) {
  const value = read(name);
  if (!value) {
    throw new Error(`Variabel lingkungan wajib tidak ditemukan: ${name}`);
  }
  return value;
}

// Dev-only ephemeral secrets let the API run without a .env; every restart
// invalidates existing refresh tokens, which is the desired failure mode for
// a machine without persisted secrets.
const devSecret = () => randomBytes(32).toString('hex');

// Nama POSTGRES_* adalah yang dipakai image postgres di container db; api
// menerima .env yang sama via env_file, jadi ia menerima kedua nama ini.
const dbPassword =
  read('DB_PASSWORD') ?? read('POSTGRES_PASSWORD')
  ?? (isProd ? undefined : 'library_dev_password');
if (isProd && !dbPassword) {
  throw new Error('DB_PASSWORD atau POSTGRES_PASSWORD wajib diisi di .env');
}

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  isProd,
  port: Number(read('PORT') ?? 3000),
  corsOrigin: read('CORS_ORIGIN') ?? 'http://localhost:5173',
  database: {
    host: read('DB_HOST') ?? 'localhost',
    port: Number(read('DB_PORT') ?? 5432),
    user: read('DB_USER') ?? read('POSTGRES_USER') ?? 'library',
    // Kredensial hanya punya fallback di development; produksi menolak jalan
    // tanpa env agar tidak ada sandi bawaan yang published di git.
    password: dbPassword,
    name: read('DB_NAME') ?? read('POSTGRES_DB') ?? 'digital_library',
  },
  jwt: {
    // Refresh tokens are opaque random strings (hashed in the DB), so only
    // the access token needs a signing secret.
    accessSecret: isProd ? required('JWT_ACCESS_SECRET') : devSecret(),
    accessTtl: read('JWT_ACCESS_TTL') ?? '15m',
    refreshTtlDays: Number(read('JWT_REFRESH_TTL_DAYS') ?? 7),
  },
  cookie: {
    secure: read('COOKIE_SECURE') === 'true',
    // Scoped path: the browser only attaches the refresh token to /api/auth/*
    // requests, never to ordinary API calls.
    path: '/api/auth',
  },
  upload: {
    dir: read('UPLOAD_DIR') ?? 'uploads',
    maxMb: Number(read('MAX_UPLOAD_MB') ?? 25),
  },
  seed: {
    adminEmail: read('ADMIN_EMAIL') ?? 'admin@kampus.ac.id',
    adminPassword: isProd ? required('ADMIN_PASSWORD') : (read('ADMIN_PASSWORD') ?? 'Admin12345'),
    adminName: read('ADMIN_NAME') ?? 'Admin Perpustakaan',
  },
  logLevel: read('LOG_LEVEL') ?? (isProd ? 'info' : 'debug'),
};
