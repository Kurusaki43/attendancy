'use server';

import { PERMISSIONS } from '@/server/auth/constants/permissions';
import { requireAuth } from '@/server/auth/guards/require-auth';
import { requirePermission } from '@/server/auth/guards/require-permission';
import { parseUserAgent } from '@/server/auth/lib/parse-user-agent';
import { listSessions } from '@/server/auth/services/list-sessions.service';
import type { ListSessionsActionResult } from '@/server/auth/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function listSessionsAction(): Promise<ActionResult<ListSessionsActionResult>> {
  return runAction(async () => {
    const user = await requirePermission(PERMISSIONS.SESSION_READ_SELF);
    const { sessionId: currentSessionId } = await requireAuth();

    const sessions = await listSessions(user.id, currentSessionId);

    return sessions.map((session) => {
      const { browser, os, deviceType } = parseUserAgent(session.userAgent);

      return {
        id: session.id,
        browser,
        os,
        deviceType,
        ipAddress: session.ipAddress,
        isCurrent: session.isCurrent,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        expiresAt: session.expiresAt,
      };
    });
  });
}
