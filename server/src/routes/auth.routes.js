import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { validate } from '../middleware/validate.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimit.js';
import { requireAuth, loadUser } from '../middleware/auth.js';
import { writeAudit } from '../middleware/audit.js';
import { HttpError } from '../middleware/errors.js';
import { loginSchema, registerSchema } from '../schemas.js';
import {
  signAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  findRefreshTokenOwner,
  setRefreshCookie,
  clearRefreshCookie,
} from '../services/token.service.js';

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

// Comparing against a throwaway hash when the email is unknown keeps the
// response time flat so login cannot reveal which accounts exist.
const DUMMY_HASH = bcrypt.hashSync('timing-equalizer', 12);

const publicUser = (user) => ({
  id: user.id,
  fullName: user.full_name,
  email: user.email,
  role: user.role,
});

const router = Router();

router.post('/register', registerLimiter, validate(registerSchema), async (req, res) => {
  const { fullName, email, password } = req.validated;

  const existing = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
  if (existing.rowCount > 0) {
    throw new HttpError(409, 'EMAIL_TAKEN', 'Email sudah terdaftar. Gunakan email lain.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, 'USER')
     RETURNING id, full_name, email, role`,
    [fullName, email, passwordHash],
  );

  writeAudit(req, { action: 'REGISTER', user: rows[0], detail: 'Pendaftaran akun pengguna baru' });
  res.status(201).json({ message: 'Pendaftaran berhasil. Silakan masuk dengan akun Anda.' });
});

router.post('/login', loginLimiter, validate(loginSchema), async (req, res) => {
  const { email, password, asAdmin } = req.validated;
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];

  if (!user) {
    bcrypt.compareSync(password, DUMMY_HASH);
    writeAudit(req, {
      action: 'LOGIN',
      contentTitle: email,
      detail: 'Percobaan masuk dengan email yang tidak terdaftar',
    });
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email atau kata sandi belum sesuai.');
  }

  if (user.locked_until && user.locked_until.getTime() > Date.now()) {
    const minutesLeft = Math.ceil((user.locked_until.getTime() - Date.now()) / 60_000);
    writeAudit(req, {
      action: 'LOGIN',
      user,
      detail: `Percobaan masuk saat akun terkunci (${minutesLeft} menit tersisa)`,
    });
    throw new HttpError(
      423,
      'ACCOUNT_LOCKED',
      `Akun terkunci karena terlalu banyak percobaan gagal. Coba lagi dalam ${minutesLeft} menit.`,
    );
  }

  if (!bcrypt.compareSync(password, user.password_hash)) {
    const attempts = user.failed_login_attempts + 1;
    const shouldLock = attempts >= MAX_ATTEMPTS;
    await pool.query(
      `UPDATE users
       SET failed_login_attempts = $2,
           locked_until = $3,
           updated_at = now()
       WHERE id = $1`,
      [user.id, attempts, shouldLock ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null],
    );
    writeAudit(req, {
      action: 'LOGIN',
      user,
      detail: shouldLock
        ? `Kata sandi salah; akun dikunci ${LOCK_MINUTES} menit`
        : `Kata sandi salah (percobaan ${attempts}/${MAX_ATTEMPTS})`,
    });
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email atau kata sandi belum sesuai.');
  }

  if (!user.is_active) {
    writeAudit(req, { action: 'LOGIN', user, detail: 'Percobaan masuk pada akun yang dinonaktifkan' });
    throw new HttpError(403, 'ACCOUNT_DISABLED', 'Akun ini dinonaktifkan. Hubungi pengelola perpustakaan.');
  }

  if (asAdmin && user.role !== 'ADMIN') {
    writeAudit(req, { action: 'LOGIN', user, detail: 'Minta panel admin tanpa otorisasi' });
    throw new HttpError(403, 'NOT_ADMIN', 'Akun ini tidak memiliki akses admin.');
  }

  await pool.query(
    'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, updated_at = now() WHERE id = $1',
    [user.id],
  );

  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user.id);
  setRefreshCookie(res, refreshToken);
  writeAudit(req, {
    action: 'LOGIN',
    user,
    detail: user.role === 'ADMIN' ? 'Masuk sebagai pengelola' : 'Masuk sebagai pengguna',
  });
  res.json({ user: publicUser(user), accessToken });
});

router.post('/refresh', async (req, res) => {
  const rawToken = req.cookies?.dl_rt;
  if (!rawToken) {
    throw new HttpError(401, 'NO_SESSION', 'Tidak ada sesi aktif.');
  }

  const result = await rotateRefreshToken(rawToken);
  if (!result.ok) {
    clearRefreshCookie(res);
    throw new HttpError(401, 'SESSION_INVALID', 'Sesi tidak valid. Silakan masuk kembali.');
  }

  setRefreshCookie(res, result.refreshToken);
  res.json({ user: publicUser(result.user), accessToken: result.accessToken });
});

router.post('/logout', async (req, res) => {
  const rawToken = req.cookies?.dl_rt;
  if (rawToken) {
    const owner = await findRefreshTokenOwner(rawToken);
    if (owner) {
      writeAudit(req, {
        action: 'LOGOUT',
        user: { id: owner.user_id, name: owner.full_name, role: owner.role },
        detail: 'Keluar dari sesi',
      });
    }
    await revokeRefreshToken(rawToken);
  }
  clearRefreshCookie(res);
  res.status(204).send();
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await loadUser(req.user.id);
  if (!user || !user.is_active) {
    throw new HttpError(401, 'NO_SESSION', 'Sesi tidak ditemukan. Silakan masuk.');
  }
  res.json({ user: publicUser(user) });
});

export default router;
