import { Monitor } from 'lucide-react';

import { getListErrorStateProps } from '@/components/shared/data-table/data-table-utils';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { RevokeOtherSessionsDialog } from '@/features/sessions/components/RevokeOtherSessionsDialog';
import { SessionsList } from '@/features/sessions/components/SessionsList';
import { listSessionsAction } from '@/server/auth/actions/list-sessions.action';

export default async function SettingsPage() {
  const result = await listSessionsAction();
  const hasMultipleSessions = result.success && result.data.length > 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-6 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sessions</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Devices currently signed into your account.
          </p>
        </div>
        {hasMultipleSessions && <RevokeOtherSessionsDialog />}
      </div>

      {result.success ? (
        result.data.length === 0 ? (
          <EmptyState
            icon={Monitor}
            title="No active sessions"
            description="You aren't signed in anywhere right now."
            className="rounded-md border"
          />
        ) : (
          <SessionsList sessions={result.data} />
        )
      ) : (
        <ErrorState
          {...getListErrorStateProps(result.code, { resourceLabel: 'sessions' })}
          className="rounded-md border"
        />
      )}
    </div>
  );
}
