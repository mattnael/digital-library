import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { pool } from '../db.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'UNAUTHENTICATED', message: 'Sesi tidak ditemukan. Silakan masuk.' });
  }
  try {
    const payload = jwt.verify(token, config.jwt.accessSecret);
    req.user = { id: payload.sub, role: payload.role, name: payload.name };
    next();
  } catch {
    return res.status(401).json({ error: 'TOKEN_EXPIRED', message: 'Sesi kedaluwarsa. Silakan masuk kembali.' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'FORBIDDEN', message: 'Akses hanya untuk pengelola perpustakaan.' });
  }
  next();
}

export async function loadUser(userId) {
  const { rows } = await pool.query(
    'SELECT id, full_name, email, role, is_active FROM users WHERE id = $1',
    [userId],
  );
  return rows[0] ?? null;
}
