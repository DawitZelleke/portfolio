import { createHash, randomBytes } from 'node:crypto';
import { jwtVerify, SignJWT } from 'jose';
import { jwtSecret } from '../../config/env.js';

export const ACCESS_TTL_SECONDS = 15 * 60;
export const REFRESH_TTL_DAYS = 14;

export type AccessClaims = { sub: string; role: 'admin' | 'editor' };

export async function signAccessToken(claims: AccessClaims): Promise<string> {
  return new SignJWT({ role: claims.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setIssuer('portfolio-api')
    .setAudience('portfolio-web')
    .setExpirationTime(`${ACCESS_TTL_SECONDS}s`)
    .sign(jwtSecret);
}

export async function verifyAccessToken(token: string): Promise<AccessClaims> {
  const { payload } = await jwtVerify(token, jwtSecret, {
    issuer: 'portfolio-api',
    audience: 'portfolio-web',
  });
  return { sub: payload.sub as string, role: payload.role as AccessClaims['role'] };
}

/** Opaque refresh token: random 256-bit value; only its hash is stored. */
export function newRefreshToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString('base64url');
  return { token, hash: hashRefreshToken(token) };
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
