# Architecture

```
                     ┌────────────────────────────┐
   Vercel (free)     │  apps/web — React 19 SPA   │
   dawitzelleke      │  Tailwind v4 · motion      │
   .vercel.app       │  TanStack Query · RHF      │
                     └─────────────┬──────────────┘
                                   │ HTTPS (CORS allow-list)
                     ┌─────────────▼──────────────┐
   VPS (~$6/mo)      │  Caddy — TLS, HSTS         │
   Docker Compose    ├────────────────────────────┤
                     │  apps/api — Express 5      │
                     │  zod · JWT · RBAC · audit  │
                     ├────────────────────────────┤
                     │  PostgreSQL 17             │
                     │  (compose network only)    │
                     └────────────────────────────┘
```

## Key properties

- **Resilient by default** — the SPA ships with bundled project fixtures;
  if the API is unreachable it renders those and the contact form offers
  the mailto fallback. A backend outage never blanks the portfolio.
- **One schema, two drivers** — Drizzle against real Postgres in
  production, embedded PGlite (actual Postgres engine, in-process) in dev
  and tests. `pnpm test` exercises real SQL with zero setup.
- **Shared contracts** — `packages/shared` zod schemas type both the API
  serializers and the web client; drift between them is a compile error.
- **Everything auditable** — logins (and failures), content changes,
  message handling, honeypot hits: one append-only table, one admin view.

## Repository

```
apps/web       Vite + React SPA (public site + /admin)
apps/api       Express 5 + Drizzle + PGlite/pg
packages/shared  zod schemas shared across the boundary
infra/         compose, Caddyfile, backup, hardening runbook
docs/          this file, security decisions, deployment
```
