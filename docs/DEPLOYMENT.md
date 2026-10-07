# Deployment runbook

Two deploy targets, independent lifecycles.

## Front end → Vercel (free)

1. Push the repo to GitHub.
2. Vercel → New Project → import the repo.
   - Root directory: `apps/web`
   - Framework preset: Vite (auto-detected)
   - Build command: `pnpm build` · Output: `dist`
3. Environment variable: `VITE_API_URL=https://api.yourdomain.com/api/v1`
   (until the VPS exists, omit it — the site runs on bundled fixtures).
4. Project → Settings → Domains: `dawitzelleke.vercel.app` (or rename).

SPA routing: add `apps/web/vercel.json` rewrite (already in repo) so
`/projects/:slug` and `/admin` resolve to `index.html`.

## API + DB → VPS

Follow `infra/hardening.md` top to bottom (access, firewall, fail2ban,
Docker, deploy, append-only role, backups). Summary once hardened:

```bash
cd /opt/portfolio/infra
cp .env.example .env   # fill secrets
docker compose up -d --build
docker compose logs -f api   # watch first boot
curl -s https://api.yourdomain.com/api/v1/health
```

### First-time database setup

```bash
# generate SQL migrations locally and commit them
pnpm --filter @portfolio/api db:generate
# apply on the server (drizzle-kit reads DATABASE_URL)
DATABASE_URL=postgres://... pnpm --filter @portfolio/api db:migrate
# create the real admin
ADMIN_EMAIL=... ADMIN_PASSWORD='...' DATABASE_URL=postgres://... pnpm --filter @portfolio/api seed:admin
```

### Updating

```bash
cd /opt/portfolio && git pull
cd infra && docker compose up -d --build
```

## Launch checklist

- [ ] Buy a domain; point `api.<domain>` A record at the VPS IP
- [ ] Replace `api.yourdomain.com` in `infra/Caddyfile`
- [ ] Set `CORS_ORIGINS` to the exact production origin
- [ ] `VITE_API_URL` set in Vercel → redeploy

### The domain swap — every place the old URL is hardcoded

Do these in one pass or the SEO tags will disagree with each other:

- [ ] `apps/web/index.html` — `canonical`, `og:url`, `og:image`, JSON-LD `url`
- [ ] `apps/web/public/sitemap.xml` — all five `<loc>` entries
- [ ] `apps/web/public/robots.txt` — the `Sitemap:` line
- [ ] `infra/.env.example` → `infra/.env` on the server — `CORS_ORIGINS`
- [ ] Vercel → Domains: add the domain, keep the `.vercel.app` as a 308 redirect
- [ ] Tighten `connect-src` in `apps/web/vercel.json` from `https:` to the exact
      API origin. If Turnstile gets wired up, it also needs
      `script-src https://challenges.cloudflare.com` and the matching `frame-src`.
- [ ] Verify the domain in Resend and change the `from:` address in
      `apps/api/src/modules/contact/routes.ts` — `onboarding@resend.dev` lands in spam

### Before the first share

- [ ] `TURNSTILE_SECRET` must stay **unset** until the widget is wired into the
      contact form — the API rejects tokenless submissions once it is set
- [ ] Paste the URL into the Facebook/LinkedIn post inspectors to warm the
      `og:image` cache (`/og.png`, 1200×630)
- [ ] Run seed:admin with a real 16+ char passphrase (never the dev default)
- [ ] Create the `portfolio_app` append-only role (hardening.md §6)
- [ ] Cron the backup script; restore one backup once to prove it works
- [ ] Turnstile keys (optional) + Resend key for contact relay
- [ ] Lighthouse pass on the deployed site (target ≥95 across the board)
