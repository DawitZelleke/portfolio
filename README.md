# DAVEVSGOLIATH — dawitzelleke.dev platform

Portfolio of **Dawit Zelleke** — full-stack developer, Ottawa. Not a
static page: a small production system, run end-to-end as proof of the
skills it presents.

- **Front end** — React 19 · TypeScript · Tailwind v4 · Vite · motion ·
  TanStack Query. Single-page portfolio + markdown case studies + admin
  dashboard. Deploys to Vercel; falls back to bundled content if the API
  is offline.
- **API** — Express 5 · Drizzle · PostgreSQL (PGlite in dev/test).
  Argon2id auth, rotating refresh tokens with reuse detection, RBAC,
  AES-256-GCM encrypted contact messages, append-only audit log,
  RFC 7807 errors. Self-hosted on a hardened VPS behind Caddy.
- **Shared** — zod contracts typing both sides of the wire.

## Quick start

```bash
pnpm install
pnpm dev        # web on :5173 (runs on fixtures)
pnpm dev:api    # api on :3001 (embedded Postgres, auto-seeded)
pnpm test       # 15 tests: RTL + supertest against a real PG engine
pnpm build      # all workspaces
```

Dev admin: `admin@portfolio.local` / `dev-password-change-me` at `/admin`.

## Docs

- `docs/architecture.md` — system shape and why
- `docs/security-decisions.md` — every control, defended
- `docs/DEPLOYMENT.md` — Vercel + VPS runbook and launch checklist
- `infra/hardening.md` — day-one server hardening, append-only audit role
