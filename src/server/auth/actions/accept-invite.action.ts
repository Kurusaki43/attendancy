'use server';

import { z } from 'zod';

import type { AcceptInviteInput } from '@/server/auth/schemas/accept-invite.schema';
import { acceptInviteSchema } from '@/server/auth/schemas/accept-invite.schema';
import { acceptInvite } from '@/server/auth/services/accept-invite.service';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function acceptInviteAction(input: AcceptInviteInput): Promise<ActionResult<null>> {
  const validated = acceptInviteSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(async () => {
    await acceptInvite(validated.data);
    return null;
  });

  return result.success ? { ...result, message: 'Account activated successfully.' } : result;
}
