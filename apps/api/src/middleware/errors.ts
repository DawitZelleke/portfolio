import type { NextFunction, Request, Response } from 'express';
import { isProd } from '../config/env.js';
import { Problem } from '../lib/problem.js';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof Problem) {
    return res.status(err.status).type('application/problem+json').json(err.toJSON());
  }
  req.log?.error({ err }, 'unhandled error');
  return res
    .status(500)
    .type('application/problem+json')
    .json({
      type: 'about:blank',
      title: 'Internal Server Error',
      status: 500,
      ...(isProd ? {} : { detail: err instanceof Error ? err.message : String(err) }),
    });
}
