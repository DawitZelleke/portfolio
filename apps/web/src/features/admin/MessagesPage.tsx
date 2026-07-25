import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SessionExpiredError, adminResources, type AdminMessage } from './adminApi';

export function MessagesPage({ onSessionExpired }: { onSessionExpired: () => void }) {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['admin', 'messages'], queryFn: adminResources.messages.list });

  useEffect(() => {
    if (query.error instanceof SessionExpiredError) onSessionExpired();
  }, [query.error, onSessionExpired]);

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminMessage['status'] }) =>
      adminResources.messages.setStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'messages'] }),
  });

  if (query.isPending) return <p className="text-ink-soft">Loading messages…</p>;
  if (query.isError)
    return (
      <p className="text-danger" role="alert">
        {query.error instanceof Error ? query.error.message : 'Could not load messages.'}
      </p>
    );

  return (
    <div>
      <h1 className="mb-6 font-display text-title font-semibold text-ink">Messages</h1>
      <ul className="space-y-4">
        {query.data.map((m) => (
          <li key={m.id} className="rounded-card border border-line bg-surface p-5 shadow-card">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <p className="font-semibold text-ink">{m.name}</p>
              <a href={`mailto:${m.email}`} className="font-mono text-xs text-accent hover:underline">
                {m.email}
              </a>
              <Chip>{m.status}</Chip>
              <span className="ml-auto font-mono text-xs text-ink-faint">
                {new Date(m.createdAt).toLocaleString()}
              </span>
            </div>
            {m.subject && <p className="mb-1 text-sm font-semibold text-ink">{m.subject}</p>}
            <p className="whitespace-pre-wrap text-[0.95rem] leading-relaxed text-ink-soft">{m.body}</p>
            <div className="mt-4 flex gap-2">
              {m.status !== 'read' && (
                <Button
                  variant="secondary"
                  className="!min-h-9 !px-3 !py-1.5 text-sm"
                  onClick={() => setStatus.mutate({ id: m.id, status: 'read' })}
                >
                  Mark read
                </Button>
              )}
              {m.status !== 'archived' && (
                <Button
                  variant="ghost"
                  className="!min-h-9 !px-3 !py-1.5 text-sm"
                  onClick={() => setStatus.mutate({ id: m.id, status: 'archived' })}
                >
                  Archive
                </Button>
              )}
            </div>
          </li>
        ))}
        {query.data.length === 0 && (
          <li className="rounded-card border border-line bg-surface px-5 py-10 text-center text-ink-soft">
            Inbox is empty. Messages from the contact form land here.
          </li>
        )}
      </ul>
    </div>
  );
}
