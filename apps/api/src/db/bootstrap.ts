import { sql } from 'drizzle-orm';
import { db } from './client.js';

/**
 * Idempotent DDL bootstrap, run on every boot in every environment.
 * Creates missing types/tables on a fresh database (PGlite or Postgres).
 * It cannot alter existing tables — schema changes need drizzle-kit
 * migrations (see drizzle.config.ts) once those are generated.
 */
export async function bootstrapSchema() {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('admin','editor');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE content_status AS ENUM ('draft','published');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE message_status AS ENUM ('new','read','archived');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text NOT NULL UNIQUE,
      password_hash text NOT NULL,
      role user_role NOT NULL DEFAULT 'admin',
      last_login_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash text NOT NULL,
      user_agent text,
      ip text,
      expires_at timestamptz NOT NULL,
      revoked_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id);`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS sessions_token_idx ON sessions (token_hash);`);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS projects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug text NOT NULL UNIQUE,
      title text NOT NULL,
      summary text NOT NULL,
      body text NOT NULL,
      tech text[] NOT NULL DEFAULT '{}',
      links jsonb NOT NULL DEFAULT '{}',
      cover_image text,
      featured boolean NOT NULL DEFAULT false,
      sort_order integer NOT NULL DEFAULT 0,
      status content_status NOT NULL DEFAULT 'draft',
      published_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  await db.execute(
    sql`CREATE INDEX IF NOT EXISTS projects_pub_idx ON projects (status, featured, sort_order);`,
  );
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text NOT NULL,
      subject text,
      body_enc bytea NOT NULL,
      body_iv bytea NOT NULL,
      ip_hash text,
      status message_status NOT NULL DEFAULT 'new',
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  await db.execute(
    sql`CREATE INDEX IF NOT EXISTS messages_status_idx ON messages (status, created_at);`,
  );
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id bigserial PRIMARY KEY,
      actor_id uuid REFERENCES users(id),
      action text NOT NULL,
      entity_type text,
      entity_id text,
      metadata jsonb NOT NULL DEFAULT '{}',
      ip text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  await db.execute(
    sql`CREATE INDEX IF NOT EXISTS audit_actor_idx ON audit_logs (actor_id, created_at);`,
  );
  await db.execute(
    sql`CREATE INDEX IF NOT EXISTS audit_entity_idx ON audit_logs (entity_type, entity_id);`,
  );
}
