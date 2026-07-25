import { hash } from '@node-rs/argon2';
import { db, schema } from './client.js';

/**
 * Dev seeding: an admin user and starter projects, only when tables are
 * empty. Production seeding happens via `pnpm seed:admin` against the
 * real database with credentials from the environment.
 */
export async function seedIfEmpty() {
  const existingUsers = await db.query.users.findMany({ limit: 1 });
  if (existingUsers.length === 0) {
    const email = process.env.ADMIN_EMAIL ?? 'admin@portfolio.local';
    const password = process.env.ADMIN_PASSWORD ?? 'dev-password-change-me';
    await db.insert(schema.users).values({
      email: email.toLowerCase(),
      passwordHash: await hash(password),
      role: 'admin',
    });
    console.log(`seeded admin user: ${email}`);
  }

  const existingProjects = await db.query.projects.findMany({ limit: 1 });
  if (existingProjects.length === 0) {
    await db.insert(schema.projects).values([
      {
        slug: 'secure-document-portal',
        title: 'Secure Document Management Portal',
        summary:
          'Backend-focused portal for encrypted document storage with role-based access control, audit logging, and a hardened REST API.',
        body: '## The problem\n\nSeeded starter content — manage the full case study from /admin.',
        tech: ['Node.js', 'Express', 'RBAC', 'Encryption', 'Audit logging'],
        links: { github: 'https://github.com/DawitZelleke' },
        featured: true,
        sortOrder: 1,
        status: 'published',
        publishedAt: new Date(),
      },
    ]);
    console.log('seeded starter project');
  }
}
