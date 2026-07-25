# Security decisions

The reasoning behind each control — written to be read, and to be
defensible in an interview.

| Control | Decision | Why this and not the alternative |
| --- | --- | --- |
| Password storage | argon2id via @node-rs/argon2 | Memory-hard (GPU-resistant); OWASP first choice. bcrypt would be acceptable; argon2id is current best practice. |
| Access tokens | HS256 JWT, 15-minute TTL, issuer+audience pinned | Short enough that a stolen token has a small window; single service, so asymmetric keys add complexity without benefit. |
| Refresh tokens | Opaque 256-bit random, SHA-256 hash stored, httpOnly SameSite=Strict cookie scoped to /api/v1/auth | DB leak exposes only hashes; JS cannot read the cookie; cross-site requests never carry it. |
| Rotation & reuse | Every refresh rotates; reuse of a revoked token revokes **all** the user's sessions | Reuse means theft or a desynced client — either way, forcing re-auth is the safe answer (RFC 6819 refresh-token rotation guidance). |
| Login timing | Unknown emails verify against a dummy argon2 hash | Response time no longer reveals which emails exist. |
| Message storage | AES-256-GCM, per-row 12-byte IV, key in env only | Authenticated encryption: tampering is detected, and a DB dump alone reveals nothing. |
| IP addresses | Never stored raw for contact; SHA-256 with a daily salt | Same-day abuse correlation without building a location log of visitors. |
| Audit log | Append-only; INSERT/SELECT-only DB role in production | Tamper-resistance enforced by Postgres privileges, not application discipline. |
| Validation | zod at every boundary (body, params, query), parsed values replace raw | Handlers only ever see data that matches the declared shape; failures are uniform RFC 7807 responses. |
| Rate limits | Global 120/min; login 5/15min; contact 5/hour | Layered: coarse protection everywhere, tight limits where abuse hurts. |
| Bot defense | Honeypot (silent 202) + optional Turnstile | The honeypot answers success so bots don't learn; Turnstile adds friction only when configured. |
| Transport | Caddy with automatic TLS, HSTS | Let's Encrypt renewal is automated; HSTS prevents downgrade. |
| Secrets | Environment-only, validated at boot, process exits if missing in production | A misconfigured deployment fails at startup, not at 2am under traffic. |
| Payload limits | JSON bodies capped at 64 KB | The API accepts text, not uploads; smaller attack surface for parser abuse. |
| Logs | pino with authorization/cookie redaction, request IDs | Credentials can't leak into logs; every error is traceable to one request. |
