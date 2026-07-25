import type { Project } from '@portfolio/shared';

/**
 * Project fixtures — schema-identical to what GET /api/v1/projects returns.
 * Once the API is live these become the offline fallback (the site keeps
 * working if the backend is unreachable).
 */
export const projectFixtures: Project[] = [
  {
    id: '0b8f4a3e-1111-4c01-9e1a-000000000001',
    slug: 'secure-document-portal',
    title: 'Secure Document Management Portal',
    summary:
      'Backend-focused portal for encrypted document storage with role-based access control, audit logging, and a hardened REST API.',
    tech: ['Node.js', 'Express', 'REST API', 'RBAC', 'Encryption', 'Audit logging'],
    links: { github: 'https://github.com/DawitZelleke' },
    coverImage: null,
    featured: true,
    sortOrder: 1,
    status: 'published',
    publishedAt: '2025-06-01T00:00:00.000Z',
    body: `## The problem

Organizations that handle sensitive documents need more than a file upload form. They need to know **who can see what**, **who did what**, and that a database breach alone doesn't expose document contents.

## What I built

A backend application supporting encrypted document storage with per-role permissions and a complete audit trail, exposed through RESTful endpoints for authentication, document management, and user authorization.

## Security decisions

| Decision | Why |
| --- | --- |
| Role-based access control on every route | Authorization enforced in middleware, not per-handler goodwill — a route without a role declaration fails closed. |
| Documents encrypted at rest | A database dump alone reveals nothing; keys live outside the data store. |
| Audit logging on every mutation | Who uploaded, downloaded, or changed permissions — recorded with actor, action, and timestamp. |
| Input validation at the boundary | Every request body validated before it touches business logic. |
| HTTPS/TLS end to end | No plaintext transport, no mixed content. |

## What it taught me

Security is architecture, not a feature checklist. The RBAC middleware pattern I built here — declare the required role next to the route, enforce it centrally — is the same pattern running in this website's own API.`,
  },
  {
    id: '0b8f4a3e-1111-4c01-9e1a-000000000002',
    slug: 'azawent-community-portal',
    title: 'Community Engagement Portal — Azawent Seniors Association',
    summary:
      'Full-stack portal for event registration, volunteer coordination, and service scheduling — deployed for a real community organization.',
    tech: ['JavaScript', 'Node.js', 'Express', 'SQL', 'Agile'],
    links: { github: 'https://github.com/DawitZelleke' },
    coverImage: null,
    featured: true,
    sortOrder: 2,
    status: 'published',
    publishedAt: '2025-01-15T00:00:00.000Z',
    body: `## The problem

The Azawent Seniors Association in Ottawa ran event registration, volunteer coordination, and a government-funded food delivery program on paper and phone calls. The people the organization serves — seniors, many new to digital services — needed something genuinely simple, and the volunteers needed something that wouldn't lose information.

## What I built

As team lead, I designed and deployed a full-stack community engagement portal: volunteer registration, event management, and service scheduling, backed by database structures designed around how the organization actually works.

## The part that mattered most

Software for seniors lives or dies on **forgiveness**: large targets, plain words, no dead ends, nothing lost on a mis-tap. I ran weekly digital literacy workshops with the same people using the portal — the feedback loop between teaching and building shaped every screen.

## Outcomes

- Replaced paper workflows for event and volunteer management.
- Supported coordination of a government-funded food delivery program.
- Delivered in milestones through an Agile-inspired process — planned, tested, debugged, iterated with real users.

## What it taught me

Requirements don't come from tickets; they come from watching someone use the thing. This project is why "usable by the least technical person in the room" is a requirement I now design for from the start.`,
  },
  {
    id: '0b8f4a3e-1111-4c01-9e1a-000000000003',
    slug: 'disaster-response-tracker',
    title: 'Disaster Response Resource Tracker',
    summary:
      'Live resource mapping for emergency response — mapping APIs integrated with backend services and data structures built for fast retrieval.',
    tech: ['JavaScript', 'Mapping APIs', 'Node.js', 'Data modelling'],
    links: { github: 'https://github.com/DawitZelleke' },
    coverImage: null,
    featured: true,
    sortOrder: 3,
    status: 'published',
    publishedAt: '2024-09-01T00:00:00.000Z',
    body: `## The problem

In an emergency, the question is always the same: *what do we have, and where is it?* Stale answers cost time exactly when time matters most.

## What I built

A resource tracker integrating mapping APIs with backend services to display live resource information on a map, with data structures designed for efficient retrieval under load.

## Engineering decisions

- **Read-optimized data design.** Lookup patterns were known in advance (by area, by resource type), so the data structures were shaped around retrieval speed rather than write elegance.
- **Backend as the source of truth.** The map renders what the API serves — one pipeline to test, one place to fix.
- **Debugging as a discipline.** Live map data fails in creative ways; systematic testing and troubleshooting were half the build.

## What it taught me

Integration work is where projects get real: third-party APIs have opinions, rate limits, and edge cases. Designing for the failure case — what renders when data is missing or late — is as important as the happy path.`,
  },
  {
    id: '0b8f4a3e-1111-4c01-9e1a-000000000004',
    slug: 'building-this-site',
    title: 'This Website — a Self-Hosted, Audited Platform',
    summary:
      'The site you are reading: React 19 front end, self-hosted Express + PostgreSQL API with JWT auth, RBAC, and append-only audit logging.',
    tech: ['React 19', 'TypeScript', 'Tailwind v4', 'Express', 'PostgreSQL', 'Drizzle', 'Docker'],
    links: { github: 'https://github.com/DawitZelleke' },
    coverImage: null,
    featured: false,
    sortOrder: 4,
    status: 'published',
    publishedAt: '2026-07-24T00:00:00.000Z',
    body: `## Why build a backend for a portfolio?

Honestly? Because claiming "Node.js, REST APIs, RBAC, encryption, audit logging" on a resume is easy. Running them in production, on a server I harden and operate myself, is proof.

## Architecture

- **Front end** — React 19 + TypeScript + Tailwind v4, built with Vite. Falls back to bundled content if the API is unreachable: the site never breaks because the backend is down.
- **API** — Express 5 + TypeScript. Versioned REST under \`/api/v1\`, request validation with zod on every endpoint, structured logging with request IDs.
- **Database** — PostgreSQL with Drizzle ORM; migrations are plain SQL I can read and explain.
- **Infrastructure** — Docker Compose (API + Postgres + Caddy) on a hardened Ubuntu VPS: SSH keys only, UFW, fail2ban, automatic security updates, nightly encrypted backups.

## Security decisions

| Decision | Why |
| --- | --- |
| Argon2id password hashing | Memory-hard; the current OWASP recommendation. |
| 15-minute JWTs + rotating refresh tokens | Stolen access tokens expire fast; refresh reuse triggers full session revocation. |
| Append-only audit log | The API's database role can INSERT and SELECT audit rows — it cannot UPDATE or DELETE them. Tamper-resistance enforced at the privilege level. |
| Contact messages encrypted at rest | AES-256-GCM with keys outside the database. |
| Rate limiting + honeypot + Turnstile | Abuse defense in layers, not one gate. |

## What it taught me

Operating software is a different skill from writing it. Backups you haven't restored are hopes, not backups.`,
  },
];
