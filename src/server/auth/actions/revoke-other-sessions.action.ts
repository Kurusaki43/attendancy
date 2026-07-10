'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requireAuth } from '@/server/auth/guards/require-auth';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { revokeOtherSessions } from '@/server/auth/services/revoke-other-sessions.service';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function revokeOtherSessionsAction(): Promise<ActionResult<void>> {
  const result = await runAction(async () => {
    const user = await requirePermission(PERMISSIONS.SESSION_REVOKE_SELF);
    const { sessionId: currentSessionId } = await requireAuth();

    await revokeOtherSessions(user.id, currentSessionId);
  });

  return result.success ? { ...result, message: 'Logged out of all other sessions.' } : result;
}
