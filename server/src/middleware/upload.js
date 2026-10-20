import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { config } from '../config.js';
import { HttpError } from './errors.js';

// Serving is pinned to these content types later, so an uploaded file can
// never come back as text/html.
const ALLOWED_TYPES = new Map([
  ['application/pdf', '.pdf'],
  ['application/epub+zip', '.epub'],
]);

export const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, config.upload.dir),
    // Random on-disk names; the original name is kept only in the database.
    filename: (_req, file, cb) => cb(null, randomUUID() + ALLOWED_TYPES.get(file.mimetype)),
  }),
  limits: { fileSize: config.upload.maxMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.has(file.mimetype)) {
      return cb(null, true);
    }
    cb(new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Hanya berkas PDF atau EPUB yang diizinkan.'));
  },
});
