import type { AttendanceEventType } from '@/generated/prisma/enums';

type OriginalAttendanceEvent = {
  id: string;
  type: AttendanceEventType;
  occurredAt: Date;
  reason: string | null;
};

type SubmittedAttendanceEvent = {
  id?: string;
  type: AttendanceEventType;
  occurredAt: Date;
  reason?: string;
};

/**
 * Filters submitted events down to the ones that actually differ from their stored original —
 * so callers can flip only those to MANUAL instead of stamping every untouched event (e.g. an
 * original QR scan) as manually edited on every save.
 */
export function getChangedAttendanceEvents<T extends SubmittedAttendanceEvent>(
  originalEvents: OriginalAttendanceEvent[],
  submittedEvents: T[],
): T[] {
  const originalsById = new Map(originalEvents.map((event) => [event.id, event]));

  return submittedEvents.filter((event) => {
    const original = event.id ? originalsById.get(event.id) : undefined;
    if (!original) return true;

    const normalizedReason = event.reason?.trim() || null;
    return (
      original.type !== event.type ||
      original.occurredAt.getTime() !== event.occurredAt.getTime() ||
      (original.reason ?? null) !== normalizedReason
    );
  });
}
