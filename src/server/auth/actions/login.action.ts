'use server';

import { headers } from 'next/dist/server/request/headers';
import { z } from 'zod';

import { type LoginInput, loginSchema } from '@/features/auth/schemas/login.schema';
import type { LoginResult } from '@/features/auth/types/action-results';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { UnauthorizedError } from '@/lib/errors/unauthorized.error';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

import {
  setAccessTokenCookie,
  setPendingEmailVerificationCookie,
  setRefreshTokenCookie,
} from '../lib/cookies';
import { userRepository } from '../repositories/user.repository';
import { login } from '../services/login.service';

export async function loginAction(input: LoginInput): Promise<ActionResult<LoginResult>> {
  const headerStore = await headers();
  const validated = loginSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const result = await runAction(
    async () => {
      const ipAddress = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
      const userAgent = headerStore.get('user-agent') ?? 'unknown';

      const { accessToken, refreshToken, user } = await login(
        validated.data,
        ipAddress,
        userAgent,
      );

      await Promise.all([setAccessTokenCookie(accessToken), setRefreshTokenCookie(refreshToken)]);

      return { user };
    },
    {
      onError: async (error) => {
        if (error instanceof UnauthorizedError && error.code === ERROR_CODES.EMAIL_NOT_VERIFIED) {
          const user = await userRepository.findByEmail(validated.data.email);

          if (user) {
            await setPendingEmailVerificationCookie(user.id);
          }

          return {
            success: false,
            code: ERROR_CODES.EMAIL_NOT_VERIFIED,
            message: 'Please verify your email first.',
          };
        }

        return undefined;
      },
    },
  );

  return result.success ? { ...result, message: `Welcome back, ${result.data.user.firstName}!` } : result;
}
