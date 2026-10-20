import pg from 'pg';
import { config } from './config.js';

// Satu-satunya titik akses database. Semua teks SQL di aplikasi berupa
// literal statis; nilai dikirim lewat array bound parameter $n.
export const pool = new pg.Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});
