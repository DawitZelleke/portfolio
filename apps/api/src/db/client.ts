import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { env } from '../config/env.js';
import * as schema from './schema/index.js';

/**
 * Driver switch:
 *  - DATABASE_URL set   → node-postgres against real Postgres (production).
 *  - DATABASE_URL absent → embedded PGlite (real Postgres engine, in-process)
 *    for dev and tests. Same SQL, same schema, no server to install.
 */
function createPgDb(pool: import('pg').Pool) {
  return drizzle(pool, { schema });
}

async function createDb() {
  if (env.DATABASE_URL) {
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: env.DATABASE_URL, max: 10 });
    return createPgDb(pool);
  }
  const { PGlite } = await import('@electric-sql/pglite');
  const pglite = new PGlite(); // in-memory
  // Same Postgres dialect and identical Drizzle API surface; the cast
  // collapses the pg/PGlite union so query types resolve to one driver.
  return drizzlePglite(pglite, { schema }) as unknown as ReturnType<typeof createPgDb>;
}

export const db = await createDb();
export type Db = typeof db;
export { schema };
