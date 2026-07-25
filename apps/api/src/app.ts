import { randomUUID } from 'node:crypto';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { corsOrigins, isTest } from './config/env.js';
import { sql } from 'drizzle-orm';
import { db } from './db/client.js';
import { errorHandler } from './middleware/errors.js';
import { authRouter } from './modules/auth/routes.js';
import { contactRouter } from './modules/contact/routes.js';
import { auditAdminRouter, messagesAdminRouter } from './modules/messages/routes.js';
import { projectsAdminRouter, projectsPublicRouter } from './modules/projects/routes.js';

/** Minimal cookie parsing — one cookie to read, zero dependencies. */
function cookies(req: express.Request, _res: express.Response, next: express.NextFunction) {
  const header = req.headers.cookie;
  const jar: Record<string, string> = {};
  if (header) {
    for (const pair of header.split(';')) {
      const idx = pair.indexOf('=');
      if (idx > 0) jar[pair.slice(0, idx).trim()] = decodeURIComponent(pair.slice(idx + 1).trim());
    }
  }
  (req as express.Request & { cookies: Record<string, string> }).cookies = jar;
  next();
}

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // behind Caddy

  // Pipeline order is deliberate: identify → log → harden → parse → limit → route
  app.use((req, _res, next) => {
    req.headers['x-request-id'] ??= randomUUID();
    next();
  });
  if (!isTest) {
    app.use(
      pinoHttp({
        genReqId: (req) => String(req.headers['x-request-id']),
        redact: ['req.headers.authorization', 'req.headers.cookie'],
      }),
    );
  }
  app.use(helmet());
  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    }),
  );
  app.use(express.json({ limit: '64kb' }));
  app.use(cookies);
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 120,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      validate: { trustProxy: false },
    }),
  );

  app.get('/api/v1/health', async (_req, res) => {
    try {
      await db.execute(sql`SELECT 1`);
      res.json({ status: 'ok' });
    } catch {
      res.status(503).json({ status: 'degraded' });
    }
  });

  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/projects', projectsPublicRouter);
  app.use('/api/v1/contact', contactRouter);
  app.use('/api/v1/admin/projects', projectsAdminRouter);
  app.use('/api/v1/admin/messages', messagesAdminRouter);
  app.use('/api/v1/admin/audit-logs', auditAdminRouter);

  app.use((_req, res) => {
    res
      .status(404)
      .type('application/problem+json')
      .json({ type: 'about:blank', title: 'Not Found', status: 404 });
  });
  app.use(errorHandler);

  return app;
}
