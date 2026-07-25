/** RFC 7807 problem+json errors — one shape for every failure. */
export class Problem extends Error {
  constructor(
    public readonly status: number,
    public readonly title: string,
    public readonly detail?: string,
    public readonly errors?: unknown,
  ) {
    super(detail ?? title);
  }

  toJSON() {
    return {
      type: 'about:blank',
      title: this.title,
      status: this.status,
      ...(this.detail ? { detail: this.detail } : {}),
      ...(this.errors ? { errors: this.errors } : {}),
    };
  }
}

export const badRequest = (detail: string, errors?: unknown) =>
  new Problem(400, 'Bad Request', detail, errors);
export const unauthorized = (detail = 'Authentication required.') =>
  new Problem(401, 'Unauthorized', detail);
export const forbidden = (detail = 'You do not have access to this resource.') =>
  new Problem(403, 'Forbidden', detail);
export const notFound = (detail = 'Resource not found.') =>
  new Problem(404, 'Not Found', detail);
export const tooMany = (detail = 'Too many requests. Try again shortly.') =>
  new Problem(429, 'Too Many Requests', detail);
