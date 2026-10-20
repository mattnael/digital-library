import rateLimit from 'express-rate-limit';

const jsonMessage = (message) => ({
  error: 'RATE_LIMITED',
  message,
});

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: jsonMessage('Terlalu banyak permintaan dari perangkat ini. Coba lagi nanti.'),
});

// Brute-force cap for credential endpoints; account lockout in the DB adds a
// second layer that survives restarts and covers distributed attempts. Only
// failed responses count, so legitimate users never hit the cap.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: jsonMessage('Terlalu banyak percobaan masuk. Tunggu beberapa menit lagi.'),
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: jsonMessage('Terlalu banyak pendaftaran dari perangkat ini. Coba lagi nanti.'),
});
