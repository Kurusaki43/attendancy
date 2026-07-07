import { unstable_rethrow } from 'next/navigation';

import { AppError } from '@/lib/errors/app.error';
import type { ActionResult } from '@/shared/types/action.types';

type ActionErrorHandler<TData> = (
  error: unknown,
) => ActionResult<TData> | Promise<ActionResult<TData> | undefined> | undefined;

/**
 * Runs a Server Action body and maps thrown AppErrors to the standard ActionResult failure
 * shape, so every action doesn't have to repeat the same try/catch. `unstable_rethrow` is called
 * first so Next's own control-flow errors (redirect/notFound from a guard like requirePermission)
 * propagate instead of being swallowed as a generic failure.
 *
 * `onError` is an escape hatch for actions that need to react to a specific error before falling
 * back to the default AppError mapping (e.g. login.action.ts flagging an unverified email).
 */
export async function runAction<TData>(
  fn: () => Promise<TData>,
  options?: { onError?: ActionErrorHandler<TData> },
): Promise<ActionResult<TData>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    unstable_rethrow(error);

    const handled = await options?.onError?.(error);
    if (handled) {
      return handled;
    }

    if (error instanceof AppError) {
      return { success: false, code: error.code, message: error.message };
    }

    return { success: false, message: 'Something went wrong.' };
  }
}
