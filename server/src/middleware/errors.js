import { config } from '../config.js';
import { logger } from '../logger.js';

export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function notFound(_req, res) {
  res.status(404).json({ error: 'NOT_FOUND', message: 'Endpoint tidak ditemukan.' });
}

// Express 5 forwards rejected promises from async routes here automatically.
export function errorHandler(err, req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.code,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  if (err?.name === 'MulterError') {
    const map = {
      LIMIT_FILE_SIZE: [413, 'PAYLOAD_TOO_LARGE', `Ukuran berkas melebihi batas ${config.upload.maxMb} MB.`],
      LIMIT_UNEXPECTED_FILE: [400, 'UNEXPECTED_FILE', 'Field berkas tidak dikenali.'],
    };
    const [status, code, message] = map[err.code] ?? [400, 'UPLOAD_ERROR', 'Berkas gagal diunggah.'];
    return res.status(status).json({ error: code, message });
  }

  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'PAYLOAD_TOO_LARGE', message: 'Ukuran data terlalu besar.' });
  }

  // Postgres unique violation, e.g. two admins creating the same course code.
  if (err?.code === '23505') {
    return res.status(409).json({ error: 'CONFLICT', message: 'Data dengan nilai yang sama sudah ada.' });
  }

  req.log?.error({ err }, 'Unhandled error');
  if (!config.isProd && err?.stack) {
    logger.error(err.stack);
  }
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    // Stack details go to logs only; responses stay generic.
    message: 'Terjadi kesalahan pada server.',
  });
}
