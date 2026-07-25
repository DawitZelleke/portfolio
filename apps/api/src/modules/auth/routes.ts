import { and, eq, gt, isNull } from 'drizzle-orm';
import { Router, type CookieOptions } from 'express';
import rateLimit from 'express-rate-limit';
import { verify } from '@node-rs/argon2';
import { z } from 'zod';
import { isProd } from '../../config/env.js';
import { db, schema } from '../../db/client.js';
import { unauthorized } from '../../lib/problem.js';
import { validate } from '../../middleware/validate.js';
import { audit } from '../audit/service.js';
import {
  ACCESS_TTL_SECONDS,
  hashRefreshToken,
  newRefreshToken,
  REFRESH_TTL_DAYS,
  signAccessToken,
} from './tokens.js';

export const authRouter = Router();

const REFRESH_COOKIE = 'refresh_token';
const cookieOpts: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'strict',
  path: '/api/v1/auth',
  maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { title: 'Too Many Requests', status: 429, detail: 'Too many sign-in attempts. Wait 15 minutes.' },
});

async function issueSession(userId: string, role: 'admin' | 'editor', req: { headers: Record<string, unknown>; ip?: string }) {
  const { token, hash } = newRefreshToken();
  await db.insert(schema.sessions).values({
    userId,
    tokenHash: hash,
    userAgent: String(req.headers['user-agent'] ?? '').slice(0, 300),
    ip: req.ip,
    expiresAt: new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000),
  });
  const accessToken = await signAccessToken({ sub: userId, role });
  return { accessToken, refreshToken: token };
}

authRouter.post(
  '/login',
  loginLimiter,
  validate('body', z.object({ email: z.string().email(), password: z.string().min(1).max(200) })),
  async (req, res, next) => {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const user = await db.query.users.findFirst({
        where: eq(schema.users.email, email.toLowerCase()),
      });
      // Verify against a dummy hash when the user is unknown, so response
      // timing does not reveal which emails exist.
      const DUMMY =
        '$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
      const ok = await verify(user?.passwordHash ?? DUMMY, password).catch(() => false);
      if (!user || !ok) {
        await audit({ action: 'auth.login_failed', metadata: { email }, ip: req.ip });
        return next(unauthorized('Email or password is incorrect.'));
      }

      const { accessToken, refreshToken } = await issueSession(user.id, user.role, req);
      await db
        .update(schema.users)
        .set({ lastLoginAt: new Date() })
        .where(eq(schema.users.id, user.id));
      await audit({ actorId: user.id, action: 'auth.login', ip: req.ip });

      res.cookie(REFRESH_COOKIE, refreshToken, cookieOpts);
      res.json({
        accessToken,
        expiresIn: ACCESS_TTL_SECONDS,
        user: { id: user.id, email: user.email, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  },
);

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const raw = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE];
    if (!raw) return next(unauthorized('No session.'));
    const tokenHash = hashRefreshToken(raw);

    const session = await db.query.sessions.findFirst({
      where: eq(schema.sessions.tokenHash, tokenHash),
    });

    if (!session) return next(unauthorized('Session not recognized.'));

    // Reuse detection: a revoked token being replayed means theft or a
    // desynced client. Revoke every session for the user and force re-auth.
    if (session.revokedAt) {
      await db
        .update(schema.sessions)
        .set({ revokedAt: new Date() })
        .where(and(eq(schema.sessions.userId, session.userId), isNull(schema.sessions.revokedAt)));
      await audit({
        actorId: session.userId,
        action: 'auth.refresh_reuse_detected',
        metadata: { sessionId: session.id },
        ip: req.ip,
      });
      res.clearCookie(REFRESH_COOKIE, cookieOpts);
      return next(unauthorized('Session invalidated. Sign in again.'));
    }

    if (session.expiresAt < new Date()) {
      return next(unauthorized('Session expired. Sign in again.'));
    }

    const user = await db.query.users.findFirst({ where: eq(schema.users.id, session.userId) });
    if (!user) return next(unauthorized());

    // Rotate: revoke current, issue a fresh pair.
    await db
      .update(schema.sessions)
      .set({ revokedAt: new Date() })
      .where(eq(schema.sessions.id, session.id));
    const { accessToken, refreshToken } = await issueSession(user.id, user.role, req);

    res.cookie(REFRESH_COOKIE, refreshToken, cookieOpts);
    res.json({
      accessToken,
      expiresIn: ACCESS_TTL_SECONDS,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/logout', async (req, res, next) => {
  try {
    const raw = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE];
    if (raw) {
      const tokenHash = hashRefreshToken(raw);
      const session = await db.query.sessions.findFirst({
        where: and(eq(schema.sessions.tokenHash, tokenHash), gt(schema.sessions.expiresAt, new Date())),
      });
      if (session) {
        await db
          .update(schema.sessions)
          .set({ revokedAt: new Date() })
          .where(eq(schema.sessions.id, session.id));
        await audit({ actorId: session.userId, action: 'auth.logout', ip: req.ip });
      }
    }
    res.clearCookie(REFRESH_COOKIE, cookieOpts);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
