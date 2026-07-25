/**
 * Production admin seeding:
 *   ADMIN_EMAIL=you@domain.com ADMIN_PASSWORD='long random phrase' pnpm seed:admin
 * Creates the admin if missing, or resets the password if present.
 */
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/client.js';

const email = process.env.ADMIN_EMAIL?.toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD.');
  process.exit(1);
}
if (password.length < 16) {
  console.error('ADMIN_PASSWORD must be at least 16 characters.');
  process.exit(1);
}

const passwordHash = await hash(password);
const existing = await db.query.users.findFirst({ where: eq(schema.users.email, email) });

if (existing) {
  await db.update(schema.users).set({ passwordHash, updatedAt: new Date() }).where(eq(schema.users.id, existing.id));
  console.log(`password reset for ${email}`);
} else {
  await db.insert(schema.users).values({ email, passwordHash, role: 'admin' });
  console.log(`admin created: ${email}`);
}
process.exit(0);
