import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { SessionExpiredError, adminResources } from './adminApi';

export function AuditPage({ onSessionExpired }: { onSessionExpired: () => void }) {
  const query = useQuery({ queryKey: ['admin', 'audit'], queryFn: adminResources.audit.list });

  useEffect(() => {
    if (query.error instanceof SessionExpiredError) onSessionExpired();
  }, [query.error, onSessionExpired]);

  if (query.isPending) return <p className="text-ink-soft">Loading audit log…</p>;
  if (query.isError)
    return (
      <p className="text-danger" role="alert">
        {query.error instanceof Error ? query.error.message : 'Could not load the audit log.'}
      </p>
    );

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="font-display text-title font-semibold text-ink">Audit log</h1>
        <p className="ledger">append-only · newest first</p>
      </div>
      <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line-strong bg-surface-2">
              <th className="px-4 py-3 font-semibold text-ink">When</th>
              <th className="px-4 py-3 font-semibold text-ink">Action</th>
              <th className="px-4 py-3 font-semibold text-ink">Entity</th>
              <th className="px-4 py-3 font-semibold text-ink">Metadata</th>
            </tr>
          </thead>
          <tbody>
            {query.data.map((e) => (
              <tr key={e.id} className="border-b border-line last:border-b-0">
                <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-ink-faint">
                  {new Date(e.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2.5 font-mono text-xs font-semibold text-accent-deep">
                  {e.action}
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-ink-soft">
                  {e.entityType ? `${e.entityType}/${(e.entityId ?? '').slice(0, 8)}` : '—'}
                </td>
                <td className="max-w-[16rem] truncate px-4 py-2.5 font-mono text-xs text-ink-faint">
                  {Object.keys(e.metadata).length > 0 ? JSON.stringify(e.metadata) : '—'}
                </td>
              </tr>
            ))}
            {query.data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink-soft">
                  No entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
