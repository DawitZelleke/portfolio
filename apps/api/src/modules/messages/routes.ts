import { and, desc, eq } from 'drizzle-orm';
import { Router } from 'express';
import { z } from 'zod';
import { db, schema } from '../../db/client.js';
import { notFound } from '../../lib/problem.js';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { audit } from '../audit/service.js';
import { decryptBody } from './crypto.js';

export const messagesAdminRouter = Router();
messagesAdminRouter.use(authenticate, requireRole('admin'));

messagesAdminRouter.get(
  '/',
  validate(
    'query',
    z.object({
      status: z.enum(['new', 'read', 'archived']).optional(),
      limit: z.coerce.number().int().min(1).max(100).default(50),
    }),
  ),
  async (req, res, next) => {
    try {
      const { status, limit } = req.query as unknown as {
        status?: 'new' | 'read' | 'archived';
        limit: number;
      };
      const rows = await db.query.messages.findMany({
        where: status ? eq(schema.messages.status, status) : undefined,
        orderBy: [desc(schema.messages.createdAt)],
        limit,
      });
      res.json(
        rows.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          subject: m.subject,
          body: decryptBody(m.bodyEnc, m.bodyIv), // decrypt on read, for the admin only
          status: m.status,
          createdAt: m.createdAt.toISOString(),
        })),
      );
    } catch (err) {
      next(err);
    }
  },
);

messagesAdminRouter.patch(
  '/:id',
  validate('params', z.object({ id: z.string().uuid() })),
  validate('body', z.object({ status: z.enum(['new', 'read', 'archived']) })),
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      const { status } = req.body as { status: 'new' | 'read' | 'archived' };
      const [row] = await db
        .update(schema.messages)
        .set({ status })
        .where(eq(schema.messages.id, id))
        .returning({ id: schema.messages.id, status: schema.messages.status });
      if (!row) return next(notFound('No such message.'));
      await audit({
        actorId: req.user!.sub,
        action: `message.${status}`,
        entityType: 'message',
        entityId: id,
        ip: req.ip,
      });
      res.json(row);
    } catch (err) {
      next(err);
    }
  },
);

export const auditAdminRouter = Router();
auditAdminRouter.use(authenticate, requireRole('admin'));

auditAdminRouter.get(
  '/',
  validate(
    'query',
    z.object({
      limit: z.coerce.number().int().min(1).max(200).default(100),
      action: z.string().max(60).optional(),
    }),
  ),
  async (req, res, next) => {
    try {
      const { limit, action } = req.query as unknown as { limit: number; action?: string };
      const rows = await db.query.auditLogs.findMany({
        where: action ? and(eq(schema.auditLogs.action, action)) : undefined,
        orderBy: [desc(schema.auditLogs.createdAt)],
        limit,
      });
      res.json(
        rows.map((a) => ({
          id: a.id,
          actorId: a.actorId,
          action: a.action,
          entityType: a.entityType,
          entityId: a.entityId,
          metadata: a.metadata,
          ip: a.ip,
          createdAt: a.createdAt.toISOString(),
        })),
      );
    } catch (err) {
      next(err);
    }
  },
);
