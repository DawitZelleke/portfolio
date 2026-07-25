import type { AccessClaims } from '../modules/auth/tokens.js';

declare global {
  namespace Express {
    interface Request {
      user?: AccessClaims;
      cookies?: Record<string, string>;
    }
  }
}

export {};
