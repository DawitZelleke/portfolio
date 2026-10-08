import { env } from './config/env.js';
import { bootstrapSchema } from './db/bootstrap.js';
import { createApp } from './app.js';
import { seedIfEmpty } from './db/seed.js';

// Idempotent DDL (CREATE ... IF NOT EXISTS): safe on every boot, in every
// environment. It creates missing tables on a fresh database; schema
// *changes* to existing tables still need real migrations.
await bootstrapSchema();

if (!env.DATABASE_URL) {
  // Embedded dev database: seed demo content. Production admins are
  // created with dist/scripts/seed-admin.js instead.
  await seedIfEmpty();
}

const app = createApp();
app.listen(env.PORT, () => {
  console.log(`portfolio-api listening on :${env.PORT} (${env.NODE_ENV})`);
});
