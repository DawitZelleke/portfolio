import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { bootstrapSchema } from '../db/bootstrap.js';
import { db, schema } from '../db/client.js';
import { createApp } from '../app.js';
import { hash } from '@node-rs/argon2';

let app: ReturnType<typeof createApp>;

beforeAll(async () => {
  await bootstrapSchema();
  await db.insert(schema.users).values({
    email: 'admin@test.local',
    passwordHash: await hash('correct horse battery staple'),
    role: 'admin',
  });
  await db.insert(schema.projects).values([
    {
      slug: 'published-project',
      title: 'Published',
      summary: 'A published project.',
      body: '## Body',
      tech: ['Node.js'],
      status: 'published',
      publishedAt: new Date(),
      sortOrder: 1,
    },
    {
      slug: 'draft-project',
      title: 'Draft',
      summary: 'A draft project.',
      body: '## Body',
      tech: [],
      status: 'draft',
      sortOrder: 2,
    },
  ]);
  app = createApp();
});

async function login() {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@test.local', password: 'correct horse battery staple' });
  expect(res.status).toBe(200);
  return {
    accessToken: res.body.accessToken as string,
    cookie: res.headers['set-cookie']![0]!,
  };
}

describe('health', () => {
  it('reports ok with a live db', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('public projects', () => {
  it('lists only published projects as cards (no body leaked)', async () => {
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].slug).toBe('published-project');
    expect(res.body[0].body).toBeUndefined();
  });

  it('serves a published project by slug and 404s drafts', async () => {
    const ok = await request(app).get('/api/v1/projects/published-project');
    expect(ok.status).toBe(200);
    expect(ok.body.body).toContain('## Body');

    const draft = await request(app).get('/api/v1/projects/draft-project');
    expect(draft.status).toBe(404);
  });

  it('rejects malformed slugs at the validation boundary', async () => {
    const res = await request(app).get('/api/v1/projects/NOT%20A%20SLUG!');
    expect(res.status).toBe(400);
  });
});

describe('auth', () => {
  it('rejects bad credentials without revealing which field failed', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.local', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.detail).toMatch(/email or password/i);
  });

  it('logs in, serves admin routes with the access token', async () => {
    const { accessToken } = await login();
    const res = await request(app)
      .get('/api/v1/admin/projects')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2); // drafts visible to admin
  });

  it('blocks admin routes without a token', async () => {
    const res = await request(app).get('/api/v1/admin/projects');
    expect(res.status).toBe(401);
  });

  it('rotates refresh tokens and detects reuse', async () => {
    const { cookie } = await login();

    const first = await request(app).post('/api/v1/auth/refresh').set('Cookie', cookie);
    expect(first.status).toBe(200);

    // Replaying the ORIGINAL (now-revoked) cookie must nuke all sessions.
    const replay = await request(app).post('/api/v1/auth/refresh').set('Cookie', cookie);
    expect(replay.status).toBe(401);

    // The rotated cookie is dead too — full revocation happened.
    const rotated = first.headers['set-cookie']![0]!;
    const afterNuke = await request(app).post('/api/v1/auth/refresh').set('Cookie', rotated);
    expect(afterNuke.status).toBe(401);
  });
});

describe('admin project CRUD + audit', () => {
  it('creates, updates, and audits', async () => {
    const { accessToken } = await login();
    const auth = { Authorization: `Bearer ${accessToken}` };

    const created = await request(app)
      .post('/api/v1/admin/projects')
      .set(auth)
      .send({ slug: 'new-project', title: 'New', summary: 'Created in test.', body: '## Hi' });
    expect(created.status).toBe(201);

    const updated = await request(app)
      .patch(`/api/v1/admin/projects/${created.body.id}`)
      .set(auth)
      .send({ status: 'published' });
    expect(updated.status).toBe(200);
    expect(updated.body.publishedAt).toBeTruthy();

    const logs = await request(app).get('/api/v1/admin/audit-logs').set(auth);
    expect(logs.status).toBe(200);
    const actions = (logs.body as Array<{ action: string }>).map((l) => l.action);
    expect(actions).toContain('project.create');
    expect(actions).toContain('project.update');
    expect(actions).toContain('auth.login');
  });
});

describe('contact', () => {
  it('accepts a valid message, stores it encrypted, decrypts for admin', async () => {
    const res = await request(app).post('/api/v1/contact').send({
      name: 'Recruiter',
      email: 'recruiter@example.com',
      subject: 'Co-op role',
      body: 'We would like to interview you next week.',
    });
    expect(res.status).toBe(202);

    // Raw row is ciphertext…
    const raw = await db.query.messages.findMany();
    expect(raw[0]!.bodyEnc.toString('utf8')).not.toContain('interview');

    // …but the admin inbox decrypts on read.
    const { accessToken } = await login();
    const inbox = await request(app)
      .get('/api/v1/admin/messages')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(inbox.status).toBe(200);
    const msg = (inbox.body as Array<{ body: string }>).find((m) =>
      m.body.includes('interview'),
    );
    expect(msg).toBeTruthy();
  });

  it('silently swallows honeypot submissions', async () => {
    const res = await request(app).post('/api/v1/contact').send({
      name: 'Bot',
      email: 'bot@example.com',
      body: 'Buy my thing buy my thing',
      website: 'https://spam.example',
    });
    expect(res.status).toBe(202); // looks accepted…
    const inbox = await db.query.messages.findMany();
    expect(inbox.some((m) => m.name === 'Bot')).toBe(false); // …but stored nowhere
  });

  it('rejects too-short messages', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({ name: 'X', email: 'x@example.com', body: 'short' });
    expect(res.status).toBe(400);
  });
});
