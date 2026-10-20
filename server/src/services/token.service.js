import { createHash, randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { pool } from '../db.js';

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export function signAccessToken(user) {
  return jwt.sign(
    { role: user.role, name: user.full_name },
    config.jwt.accessSecret,
    { subject: user.id, expiresIn: config.jwt.accessTtl },
  );
}

export async function issueRefreshToken(userId) {
  const token = randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + config.jwt.refreshTtlDays * 24 * 60 * 60 * 1000);
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, sha256(token), expiresAt],
  );
  return token;
}

export function setRefreshCookie(res, token) {
  res.cookie('dl_rt', token, {
    httpOnly: true,
    secure: config.cookie.secure,
    sameSite: 'lax',
    path: config.cookie.path,
    maxAge: config.jwt.refreshTtlDays * 24 * 60 * 60 * 1000,
  });
}

export function clearRefreshCookie(res) {
  res.clearCookie('dl_rt', { path: config.cookie.path });
}

export async function rotateRefreshToken(rawToken) {
  const { rows } = await pool.query(
    `SELECT rt.id, rt.user_id, rt.expires_at, rt.revoked_at,
            u.full_name, u.email, u.role, u.is_active
     FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = $1`,
    [sha256(rawToken)],
  );
  const row = rows[0];
  if (!row) {
    return { ok: false, reason: 'unknown' };
  }

  // A revoked token being replayed means the cookie leaked, so every session
  // for the user is invalidated, not just this one.
  if (row.revoked_at) {
    await pool.query(
      'UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL',
      [row.user_id],
    );
    return { ok: false, reason: 'reuse' };
  }
  if (row.expires_at.getTime() < Date.now()) {
    return { ok: false, reason: 'expired' };
  }
  if (!row.is_active) {
    return { ok: false, reason: 'inactive' };
  }

  await pool.query('UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1', [row.id]);
  const user = { id: row.user_id, full_name: row.full_name, email: row.email, role: row.role };
  return {
    ok: true,
    user,
    accessToken: signAccessToken(user),
    refreshToken: await issueRefreshToken(user.id),
  };
}

export async function revokeRefreshToken(rawToken) {
  await pool.query(
    'UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL',
    [sha256(rawToken)],
  );
}

export async function findRefreshTokenOwner(rawToken) {
  const { rows } = await pool.query(
    `SELECT rt.user_id, u.full_name, u.role
     FROM refresh_tokens rt JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = $1`,
    [sha256(rawToken)],
  );
  return rows[0] ?? null;
}
