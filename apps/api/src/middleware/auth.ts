import type { NextFunction, Request, Response } from 'express';
import { forbidden, unauthorized } from '../lib/problem.js';
import { verifyAccessToken, type AccessClaims } from '../modules/auth/tokens.js';

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(unauthorized());
  try {
    req.user = await verifyAccessToken(header.slice(7));
    next();
  } catch {
    next(unauthorized('Your session has expired. Sign in again.'));
  }
}

/** RBAC: declare the required role next to the route; fail closed. */
export function requireRole(...roles: Array<AccessClaims['role']>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) return next(forbidden());
    next();
  };
}
