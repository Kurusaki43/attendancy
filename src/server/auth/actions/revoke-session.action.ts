'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { revokeSession } from '@/server/auth/services/revoke-session.service';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function revokeSessionAction(sessionId: string): Promise<ActionResult<void>> {
  const result = await runAction(async () => {
    const user = await requirePermission(PERMISSIONS.SESSION_REVOKE_SELF);
    await revokeSession(user.id, sessionId);
  });

  return result.success ? { ...result, message: 'Session logged out.' } : result;
}
