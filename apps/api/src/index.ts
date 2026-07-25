import { env } from './config/env.js';
import { bootstrapSchema } from './db/bootstrap.js';
import { createApp } from './app.js';
import { seedIfEmpty } from './db/seed.js';

if (!env.DATABASE_URL) {
  // Embedded dev database: create schema + seed content on boot.
  await bootstrapSchema();
  await seedIfEmpty();
}

const app = createApp();
app.listen(env.PORT, () => {
  console.log(`portfolio-api listening on :${env.PORT} (${env.NODE_ENV})`);
});
