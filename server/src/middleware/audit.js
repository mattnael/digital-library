import { pool } from '../db.js';

// Audit writes are fire-and-forget: a logging failure must never fail the
// user's request, but it should still surface in operational logs.
export function writeAudit(req, { action, contentId = null, contentTitle = null, detail = null, user = null }) {
  const actor = user ?? req.user ?? null;
  // Pemanggil bisa mengirim req.user (camelCase) atau baris DB (snake_case).
  pool.query(
    `INSERT INTO activity_logs
       (user_id, user_name, user_role, action, content_id, content_title, detail, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      actor?.id ?? null,
      actor?.name ?? actor?.full_name ?? null,
      actor?.role ?? null,
      action,
      contentId,
      contentTitle,
      detail,
      req.ip ?? null,
      (req.headers['user-agent'] ?? '').slice(0, 255),
    ],
  ).catch((err) => req.log?.error({ err }, 'Gagal menulis audit log'));
}
