import { randomUUID } from 'node:crypto';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { config } from './config.js';
import { logger } from './logger.js';
import { pool } from './db.js';
import { httpMetrics } from './metrics.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { requireAuth } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/errors.js';
import authRoutes from './routes/auth.routes.js';
import { categoryListRouter, categoryCrudRouter } from './routes/category.routes.js';
import contentRoutes from './routes/content.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { metricsHandler } from './metrics.js';

export function createApp() {
  const app = express();

  // Satu hop nginx di depan API; dibutuhkan agar req.ip (rate limit, audit)
  // menunjuk ke klien asli, bukan ke nginx.
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(globalLimiter);
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(
    pinoHttp({
      logger,
      genReqId: () => randomUUID(),
      autoLogging: {
        ignore: (req) => req.url === '/api/health' || req.url?.startsWith('/metrics'),
      },
    }),
  );
  app.use(httpMetrics());

  app.get('/api/health', async (_req, res) => {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  // Jalur utama yang dipakai frontend...
  app.use('/api', requireAuth, categoryListRouter, categoryCrudRouter, contentRoutes, adminRoutes);
  // ...dan alias /api/categories/* sesuai kontrak handoff.
  app.use('/api/categories', requireAuth, categoryCrudRouter);
  app.get('/metrics', metricsHandler);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
