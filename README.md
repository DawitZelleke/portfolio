# DAVEVSGOLIATH — Portfolio Platform

Personal portfolio of Dawit Zelleke: single-page public site + case studies,
backed by a self-hosted Express/Postgres API. See `docs/` and the project
spec for architecture and security decisions.

## Workspace

pnpm monorepo:

- `apps/web` — Vite + React 19 + TypeScript + Tailwind v4 (public site + admin)
- `apps/api` — Express 5 + TypeScript (M0 stub; full build in M4/M5)
- `packages/shared` — zod schemas shared between web and api
- `infra/` — Docker Compose, Caddy, VPS hardening docs (M7)

## Commands

```bash
pnpm install        # all workspaces
pnpm dev            # web dev server
pnpm dev:api        # api dev server (stub)
pnpm lint           # eslint (flat config, root)
pnpm typecheck      # all workspaces
pnpm test           # all workspaces
pnpm build          # all workspaces
```

## Roadmap

M0 foundation ✅ → M1 design system → M2 public site → M3 case studies
→ M4 API core → M5 auth + admin → M6 hardening → M7 ship
