import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { HttpError } from '../middleware/errors.js';
import { activityLogQuerySchema, parseQuery } from '../schemas.js';

const router = Router();

router.get('/admin/stats', requireAuth, requireAdmin, async (_req, res) => {
  const contents = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      (COUNT(*) FILTER (WHERE content_type = 'E-book'))::int AS ebook,
      (COUNT(*) FILTER (WHERE content_type = 'Research Paper'))::int AS paper,
      (COUNT(*) FILTER (WHERE content_type = 'Video YouTube'))::int AS video
    FROM contents`);
  const users = await pool.query('SELECT COUNT(*)::int AS total FROM users');

  res.json({
    total: contents.rows[0].total,
    ebook: contents.rows[0].ebook,
    paper: contents.rows[0].paper,
    video: contents.rows[0].video,
    users: users.rows[0].total,
  });
});

router.get('/admin/activity-logs', requireAuth, requireAdmin, async (req, res) => {
  const parsed = parseQuery(activityLogQuerySchema, req.query);
  if (parsed.error) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Filter tidak valid.', parsed.error.map((message) => ({ message })));
  }

  const { from, to, action, userId, page, limit } = parsed.data;
  const result = await pool.query(
    'SELECT * FROM list_activity_logs($1, $2, $3, $4, $5, $6)',
    [from || null, to || null, action || null, userId || null, limit, (page - 1) * limit],
  );

  const rows = result.rows;
  const total = Number(rows[0]?.total_count ?? 0);
  res.json({
    data: rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      userName: row.user_name,
      userRole: row.user_role,
      action: row.action,
      contentId: row.content_id,
      contentTitle: row.content_title,
      detail: row.detail,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      createdAt: row.created_at,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});

// Sumber dropdown filter "Admin/Pengguna" pada halaman Activity Logs.
router.get('/admin/users', requireAuth, requireAdmin, async (_req, res) => {
  const { rows } = await pool.query('SELECT id, full_name, email, role FROM users ORDER BY full_name');
  res.json({
    data: rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      role: row.role,
    })),
  });
});

export default router;
