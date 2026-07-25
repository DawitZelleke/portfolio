import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { badRequest } from '../lib/problem.js';

type Part = 'body' | 'params' | 'query';

/** Zod validation at the boundary; parsed values replace the raw ones. */
export function validate(part: Part, schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      return next(
        badRequest('Request validation failed.', result.error.flatten().fieldErrors),
      );
    }
    if (part === 'query') {
      Object.assign(req.query, result.data);
    } else {
      req[part] = result.data as never;
    }
    next();
  };
}
