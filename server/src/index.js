import { mkdirSync } from 'node:fs';
import { config } from './config.js';
import { logger } from './logger.js';
import { pool } from './db.js';
import { createApp } from './app.js';
import { runSeed } from './seed.js';

async function main() {
  // Gagal cepat jika database belum siap; compose menunggu healthcheck db
  // sebelum menyalakan API, jadi error di sini berarti masalah nyata.
  await pool.query('SELECT 1');

  mkdirSync(config.upload.dir, { recursive: true });
  await runSeed();

  const app = createApp();
  const server = app.listen(config.port, () => {
    logger.info({ port: config.port, env: config.env }, 'API berjalan');
  });

  const shutdown = (signal) => {
    logger.info({ signal }, 'Mematikan server');
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
    // Jaga-jaga jika ada koneksi yang tidak selesai dalam batas waktu.
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error({ err }, 'API gagal dijalankan');
  process.exit(1);
});
