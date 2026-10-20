import pino from 'pino';
import { config } from './config.js';

export const logger = pino({
  level: config.logLevel,
  // Credentials never belong in logs, whatever the request contained.
  redact: ['req.headers.authorization', 'req.headers.cookie'],
  base: undefined,
});
