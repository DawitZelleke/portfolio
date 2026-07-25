import { db, schema } from '../../db/client.js';

type AuditInput = {
  actorId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
};

/**
 * Append an audit entry. Audit failures are logged but never fail the
 * user's request — the action already happened; losing the request on
 * top of losing the log entry helps no one.
 */
export async function audit(entry: AuditInput): Promise<void> {
  try {
    await db.insert(schema.auditLogs).values({
      actorId: entry.actorId ?? null,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      metadata: entry.metadata ?? {},
      ip: entry.ip,
    });
  } catch (err) {
    console.error('audit write failed', err);
  }
}
