import { z } from 'zod';

/**
 * Environment is parsed once, at boot, with zod. A misconfigured
 * deployment fails loudly at startup — never silently at request time.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),

  /** Absent in dev/test → embedded PGlite engine is used instead. */
  DATABASE_URL: z.string().url().optional(),

  /** 32-byte hex key for AES-256-GCM at-rest encryption of messages. */
  MESSAGE_ENC_KEY: z
    .string()
    .regex(/^[0-9a-f]{64}$/i, 'MESSAGE_ENC_KEY must be 64 hex chars (32 bytes)')
    .optional(),

  /** HS256 signing secret for access tokens. */
  JWT_SECRET: z.string().min(32).optional(),

  CORS_ORIGINS: z.string().default('http://localhost:5173'),

  RESEND_API_KEY: z.string().optional(),
  CONTACT_TO_EMAIL: z.string().email().optional(),
  TURNSTILE_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

/* In production, optional-for-dev secrets become mandatory. */
if (isProd) {
  const required: Array<keyof typeof env> = [
    'DATABASE_URL',
    'MESSAGE_ENC_KEY',
    'JWT_SECRET',
  ];
  const missing = required.filter((k) => !env[k]);
  if (missing.length > 0) {
    console.error(`Missing required production env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
}

/** Dev/test fallbacks — never used in production (guarded above). */
export const jwtSecret = new TextEncoder().encode(
  env.JWT_SECRET ?? 'dev-only-secret-do-not-use-in-production!!',
);
export const messageEncKey = Buffer.from(
  env.MESSAGE_ENC_KEY ?? '00'.repeat(32),
  'hex',
);
export const corsOrigins = env.CORS_ORIGINS.split(',').map((s) => s.trim());
