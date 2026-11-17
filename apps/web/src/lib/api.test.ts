import { afterEach, describe, expect, it, vi } from 'vitest';
import { projectFixtures } from '@/content/projects';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('public project content', () => {
  it('uses reviewed content without consulting stale database records by default', async () => {
    vi.stubEnv('VITE_PROJECT_SOURCE', '');
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const { fetchProjects, fetchProject } = await import('./api');
    expect((await fetchProjects()).filter((p) => p.featured).map((p) => p.slug)).toEqual([
      'budget-tracker',
      'devtalk-security',
      'ideanest',
    ]);
    expect((await fetchProject('devtalk-security'))?.links.github).toBe(
      'https://github.com/DawitZelleke/devtalk-labs',
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('allows explicitly selected API records and falls back if the API fails', async () => {
    vi.stubEnv('VITE_PROJECT_SOURCE', 'api');
    vi.stubEnv('VITE_STATIC_ONLY', 'false');
    const record = { ...projectFixtures[0], title: 'Admin-managed record' };
    const fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [record] })
      .mockRejectedValueOnce(new Error('offline'));
    vi.stubGlobal('fetch', fetch);
    const { fetchProjects, fetchProject } = await import('./api');
    expect((await fetchProjects())[0].title).toBe('Admin-managed record');
    expect((await fetchProject('budget-tracker'))?.title).toBe('Budget Tracker');
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
