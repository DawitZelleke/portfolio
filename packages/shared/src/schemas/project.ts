import { z } from 'zod';

export const projectLinksSchema = z
  .object({
    github: z.string().url().optional(),
    live: z.string().url().optional(),
    docs: z.string().url().optional(),
  })
  .strict();

export const projectSchema = z.object({
  id: z.string().uuid(),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'kebab-case only'),
  title: z.string().min(1).max(120),
  summary: z.string().min(1).max(300),
  body: z.string().min(1),
  tech: z.array(z.string().min(1).max(40)).max(20),
  links: projectLinksSchema,
  coverImage: z.string().nullable(),
  featured: z.boolean(),
  sortOrder: z.number().int(),
  status: z.enum(['draft', 'published']),
  publishedAt: z.string().datetime().nullable(),
});

/** Card-level projection served by GET /projects */
export const projectCardSchema = projectSchema.pick({
  id: true,
  slug: true,
  title: true,
  summary: true,
  tech: true,
  links: true,
  coverImage: true,
  featured: true,
  sortOrder: true,
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectCard = z.infer<typeof projectCardSchema>;
