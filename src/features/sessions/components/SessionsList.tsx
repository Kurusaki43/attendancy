import type { SessionResult } from '@/server/auth/types/action-results';

import { SessionCard } from './SessionCard';

type SessionsListProps = {
  sessions: SessionResult[];
};

export function SessionsList({ sessions }: SessionsListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}
