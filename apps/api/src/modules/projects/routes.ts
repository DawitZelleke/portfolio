import { asc, eq } from 'drizzle-orm';
import { Router } from 'express';
import { z } from 'zod';
import { db, schema } from '../../db/client.js';
import { notFound } from '../../lib/problem.js';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { audit } from '../audit/service.js';

/* ---------- serializers ---------- */

type ProjectRow = typeof schema.projects.$inferSelect;

const toCard = (p: ProjectRow) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  summary: p.summary,
  tech: p.tech,
  links: p.links,
  coverImage: p.coverImage,
  featured: p.featured,
  sortOrder: p.sortOrder,
});

const toFull = (p: ProjectRow) => ({
  ...toCard(p),
  body: p.body,
  status: p.status,
  publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
});

/* ---------- public ---------- */

export const projectsPublicRouter = Router();

projectsPublicRouter.get('/', async (_req, res, next) => {
  try {
    const rows = await db.query.projects.findMany({
      where: eq(schema.projects.status, 'published'),
      orderBy: [asc(schema.projects.sortOrder)],
    });
    res.json(rows.map(toCard));
  } catch (err) {
    next(err);
  }
});

projectsPublicRouter.get(
  '/:slug',
  validate('params', z.object({ slug: z.string().regex(/^[a-z0-9-]{1,80}$/) })),
  async (req, res, next) => {
    try {
      const row = await db.query.projects.findFirst({
        where: eq(schema.projects.slug, req.params.slug as string),
      });
      if (!row || row.status !== 'published') return next(notFound('No such project.'));
      res.json(toFull(row));
    } catch (err) {
      next(err);
    }
  },
);

/* ---------- admin ---------- */

const projectInput = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  title: z.string().min(1).max(120),
  summary: z.string().min(1).max(300),
  body: z.string().min(1),
  tech: z.array(z.string().min(1).max(40)).max(20).default([]),
  links: z
    .object({
      github: z.string().url().optional(),
      live: z.string().url().optional(),
      docs: z.string().url().optional(),
    })
    .default({}),
  coverImage: z.string().nullable().default(null),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const projectsAdminRouter = Router();
projectsAdminRouter.use(authenticate, requireRole('admin', 'editor'));

projectsAdminRouter.get('/', async (_req, res, next) => {
  try {
    const rows = await db.query.projects.findMany({
      orderBy: [asc(schema.projects.sortOrder)],
    });
    res.json(rows.map(toFull));
  } catch (err) {
    next(err);
  }
});

projectsAdminRouter.post('/', validate('body', projectInput), async (req, res, next) => {
  try {
    const input = req.body as z.infer<typeof projectInput>;
    const [row] = await db
      .insert(schema.projects)
      .values({
        ...input,
        publishedAt: input.status === 'published' ? new Date() : null,
      })
      .returning();
    await audit({
      actorId: req.user!.sub,
      action: 'project.create',
      entityType: 'project',
      entityId: row!.id,
      metadata: { slug: row!.slug },
      ip: req.ip,
    });
    res.status(201).json(toFull(row!));
  } catch (err) {
    next(err);
  }
});

projectsAdminRouter.patch(
  '/:id',
  validate('params', z.object({ id: z.string().uuid() })),
  validate('body', projectInput.partial()),
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      const patch = req.body as Partial<z.infer<typeof projectInput>>;
      const existing = await db.query.projects.findFirst({ where: eq(schema.projects.id, id) });
      if (!existing) return next(notFound('No such project.'));

      const publishedAt =
        patch.status === 'published' && existing.status !== 'published'
          ? new Date()
          : existing.publishedAt;

      const [row] = await db
        .update(schema.projects)
        .set({ ...patch, publishedAt, updatedAt: new Date() })
        .where(eq(schema.projects.id, id))
        .returning();

      await audit({
        actorId: req.user!.sub,
        action: 'project.update',
        entityType: 'project',
        entityId: id,
        metadata: { fields: Object.keys(patch) },
        ip: req.ip,
      });
      res.json(toFull(row!));
    } catch (err) {
      next(err);
    }
  },
);

projectsAdminRouter.delete(
  '/:id',
  requireRole('admin'),
  validate('params', z.object({ id: z.string().uuid() })),
  async (req, res, next) => {
    try {
      const id = req.params.id as string;
      const [row] = await db.delete(schema.projects).where(eq(schema.projects.id, id)).returning();
      if (!row) return next(notFound('No such project.'));
      await audit({
        actorId: req.user!.sub,
        action: 'project.delete',
        entityType: 'project',
        entityId: id,
        metadata: { slug: row.slug },
        ip: req.ip,
      });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
);
