import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { FieldWrap, TextArea, TextInput } from '@/components/ui/Field';
import { Chip } from '@/components/ui/Chip';
import { SessionExpiredError, adminResources, type AdminProject } from './adminApi';

type EditorValues = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  tech: string;
  github: string;
  live: string;
  featured: boolean;
  sortOrder: number;
};

const toValues = (p?: AdminProject): EditorValues => ({
  slug: p?.slug ?? '',
  title: p?.title ?? '',
  summary: p?.summary ?? '',
  body: p?.body ?? '',
  tech: p?.tech.join(', ') ?? '',
  github: p?.links.github ?? '',
  live: p?.links.live ?? '',
  featured: p?.featured ?? false,
  sortOrder: p?.sortOrder ?? 0,
});

const fromValues = (v: EditorValues): Partial<AdminProject> => ({
  slug: v.slug.trim(),
  title: v.title.trim(),
  summary: v.summary.trim(),
  body: v.body,
  tech: v.tech.split(',').map((t) => t.trim()).filter(Boolean),
  links: {
    ...(v.github.trim() ? { github: v.github.trim() } : {}),
    ...(v.live.trim() ? { live: v.live.trim() } : {}),
  },
  featured: v.featured,
  sortOrder: Number(v.sortOrder) || 0,
});

export function ProjectsAdminPage({ onSessionExpired }: { onSessionExpired: () => void }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<AdminProject | 'new' | null>(null);

  const query = useQuery({ queryKey: ['admin', 'projects'], queryFn: adminResources.projects.list });

  useEffect(() => {
    if (query.error instanceof SessionExpiredError) onSessionExpired();
  }, [query.error, onSessionExpired]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'projects'] });
    qc.invalidateQueries({ queryKey: ['projects'] });
  };

  const save = useMutation({
    mutationFn: (values: EditorValues) =>
      editing === 'new' || !editing
        ? adminResources.projects.create(fromValues(values))
        : adminResources.projects.update(editing.id, fromValues(values)),
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
  });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'draft' | 'published' }) =>
      adminResources.projects.update(id, { status }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminResources.projects.remove(id),
    onSuccess: invalidate,
  });

  if (query.isPending) return <p className="text-ink-soft">Loading projects…</p>;
  if (query.isError)
    return (
      <p className="text-danger" role="alert">
        {query.error instanceof Error ? query.error.message : 'Could not load projects.'}
      </p>
    );

  if (editing !== null) {
    return (
      <ProjectEditor
        project={editing === 'new' ? undefined : editing}
        pending={save.isPending}
        error={save.error instanceof Error ? save.error.message : undefined}
        onCancel={() => setEditing(null)}
        onSave={(v) => save.mutate(v)}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-title font-semibold text-ink">Projects</h1>
        <Button onClick={() => setEditing('new')}>New project</Button>
      </div>
      <ul className="divide-y divide-line rounded-card border border-line bg-surface shadow-card">
        {query.data.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-ink">{p.title}</p>
              <p className="font-mono text-xs text-ink-faint">
                /{p.slug} · order {p.sortOrder}
              </p>
            </div>
            <Chip>{p.status}</Chip>
            <div className="flex items-center gap-2">
              <Button variant="secondary" className="!min-h-9 !px-3 !py-1.5 text-sm" onClick={() => setEditing(p)}>
                Edit
              </Button>
              <Button
                variant="secondary"
                className="!min-h-9 !px-3 !py-1.5 text-sm"
                disabled={setStatus.isPending}
                onClick={() =>
                  setStatus.mutate({
                    id: p.id,
                    status: p.status === 'published' ? 'draft' : 'published',
                  })
                }
              >
                {p.status === 'published' ? 'Unpublish' : 'Publish'}
              </Button>
              <Button
                variant="ghost"
                className="!min-h-9 !px-3 !py-1.5 text-sm !text-danger"
                disabled={remove.isPending}
                onClick={() => {
                  if (window.confirm(`Delete “${p.title}”? This cannot be undone.`)) {
                    remove.mutate(p.id);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
        {query.data.length === 0 && (
          <li className="px-5 py-10 text-center text-ink-soft">
            No projects yet. Create the first one.
          </li>
        )}
      </ul>
    </div>
  );
}

function ProjectEditor({
  project,
  pending,
  error,
  onSave,
  onCancel,
}: {
  project?: AdminProject;
  pending: boolean;
  error?: string;
  onSave: (values: EditorValues) => void;
  onCancel: () => void;
}) {
  const { register, handleSubmit } = useForm<EditorValues>({ defaultValues: toValues(project) });

  return (
    <form onSubmit={handleSubmit(onSave)} className="max-w-3xl space-y-5" noValidate>
      <h1 className="font-display text-title font-semibold text-ink">
        {project ? `Edit: ${project.title}` : 'New project'}
      </h1>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrap label="Title" htmlFor="p-title">
          <TextInput id="p-title" {...register('title')} />
        </FieldWrap>
        <FieldWrap label="Slug" htmlFor="p-slug" hint="kebab-case, forms the URL">
          <TextInput id="p-slug" {...register('slug')} />
        </FieldWrap>
      </div>
      <FieldWrap label="Summary" htmlFor="p-summary" hint="Card text, max 300 chars">
        <TextArea id="p-summary" rows={2} {...register('summary')} />
      </FieldWrap>
      <FieldWrap label="Body (markdown)" htmlFor="p-body">
        <TextArea id="p-body" rows={16} className="font-mono text-sm" {...register('body')} />
      </FieldWrap>
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrap label="Tech" htmlFor="p-tech" hint="Comma-separated">
          <TextInput id="p-tech" {...register('tech')} />
        </FieldWrap>
        <FieldWrap label="Sort order" htmlFor="p-order">
          <TextInput id="p-order" type="number" {...register('sortOrder')} />
        </FieldWrap>
        <FieldWrap label="GitHub link" htmlFor="p-github">
          <TextInput id="p-github" type="url" {...register('github')} />
        </FieldWrap>
        <FieldWrap label="Live link" htmlFor="p-live">
          <TextInput id="p-live" type="url" {...register('live')} />
        </FieldWrap>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input type="checkbox" {...register('featured')} /> Featured
      </label>
      {error && (
        <p className="rounded-field bg-danger-tint px-4 py-3 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save project'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
