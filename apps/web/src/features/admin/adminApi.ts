/**
 * Admin API client. The access token lives in module memory only —
 * never localStorage (XSS cannot read what is not stored). The refresh
 * token is an httpOnly cookie scoped to /api/v1/auth; on 401 we attempt
 * one silent refresh and replay the request.
 */
const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export type AdminUser = { id: string; email: string; role: 'admin' | 'editor' };

let accessToken: string | null = null;
let currentUser: AdminUser | null = null;

export const adminSession = {
  get user() {
    return currentUser;
  },
  get isAuthed() {
    return accessToken !== null;
  },
};

type LoginResponse = { accessToken: string; expiresIn: number; user: AdminUser };

async function handleAuthResponse(res: Response): Promise<AdminUser> {
  if (!res.ok) {
    const problem = (await res.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(problem?.detail ?? 'Sign-in failed.');
  }
  const data = (await res.json()) as LoginResponse;
  accessToken = data.accessToken;
  currentUser = data.user;
  return data.user;
}

export async function login(email: string, password: string): Promise<AdminUser> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleAuthResponse(res);
}

export async function tryRefresh(): Promise<AdminUser | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return null;
    return await handleAuthResponse(res);
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(
    () => undefined,
  );
  accessToken = null;
  currentUser = null;
}

/** Authenticated fetch with one silent refresh-and-replay on 401. */
export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const attempt = () =>
    fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });

  let res = await attempt();
  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (!refreshed) throw new SessionExpiredError();
    res = await attempt();
  }
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const problem = (await res.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(problem?.detail ?? `Request failed (${res.status}).`);
  }
  return res.json() as Promise<T>;
}

export class SessionExpiredError extends Error {
  constructor() {
    super('Your session has expired. Sign in again.');
  }
}

/* ---------- typed resources ---------- */

export type AdminProject = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  tech: string[];
  links: { github?: string; live?: string; docs?: string };
  coverImage: string | null;
  featured: boolean;
  sortOrder: number;
  status: 'draft' | 'published';
  publishedAt: string | null;
};

export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
};

export type AuditEntry = {
  id: number;
  actorId: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown>;
  ip: string | null;
  createdAt: string;
};

export const adminResources = {
  projects: {
    list: () => adminFetch<AdminProject[]>('/admin/projects'),
    create: (input: Partial<AdminProject>) =>
      adminFetch<AdminProject>('/admin/projects', { method: 'POST', body: JSON.stringify(input) }),
    update: (id: string, patch: Partial<AdminProject>) =>
      adminFetch<AdminProject>(`/admin/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      }),
    remove: (id: string) => adminFetch<void>(`/admin/projects/${id}`, { method: 'DELETE' }),
  },
  messages: {
    list: () => adminFetch<AdminMessage[]>('/admin/messages?limit=100'),
    setStatus: (id: string, status: AdminMessage['status']) =>
      adminFetch<{ id: string; status: string }>(`/admin/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
  audit: {
    list: () => adminFetch<AuditEntry[]>('/admin/audit-logs?limit=150'),
  },
};
