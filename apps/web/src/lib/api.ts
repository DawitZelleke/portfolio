import {
  projectCardSchema,
  projectSchema,
  type Project,
  type ProjectCard,
} from '@portfolio/shared';
import { z } from 'zod';
import { projectFixtures } from '@/content/projects';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

const USE_PROJECT_API = import.meta.env.VITE_PROJECT_SOURCE === 'api';

async function getJson(path: string): Promise<unknown> {
  if (import.meta.env.VITE_STATIC_ONLY === 'true')
    throw new Error('Bundled content mode');
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

/**
 * Public projects use reviewed bundled content by default. Set
 * VITE_PROJECT_SOURCE=api to use admin-managed records with a bundled fallback.
 */
export async function fetchProjects(): Promise<ProjectCard[]> {
  try {
    if (!USE_PROJECT_API) throw new Error('Curated project content');
    const data = await getJson('/projects');
    return z.array(projectCardSchema).parse(data);
  } catch {
    return projectFixtures
      .filter((p) => p.status === 'published')
      .map(
        ({ id, slug, title, summary, tech, links, coverImage, featured, sortOrder }) => ({
          id,
          slug,
          title,
          summary,
          tech,
          links,
          coverImage,
          featured,
          sortOrder,
        }),
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
}

export async function fetchProject(slug: string): Promise<Project | null> {
  try {
    if (!USE_PROJECT_API) throw new Error('Curated project content');
    const data = await getJson(`/projects/${slug}`);
    return projectSchema.parse(data);
  } catch {
    return (
      projectFixtures.find((p) => p.slug === slug && p.status === 'published') ?? null
    );
  }
}

export async function submitContact(input: {
  name: string;
  email: string;
  subject?: string;
  body: string;
  website?: string; // honeypot
  turnstileToken?: string;
}): Promise<{ ok: true }> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const problem = (await res.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(problem?.detail ?? 'Could not send your message.');
  }
  return { ok: true };
}
