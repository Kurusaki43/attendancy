'use server';

import { headers } from 'next/dist/server/request/headers';
import { z } from 'zod';

import { ERROR_CODES } from '@/lib/errors/error-codes';
import { UnauthorizedError } from '@/lib/errors/unauthorized.error';
import { RATE_LIMITS } from '@/server/auth/constants/rate-limit.constant';
import { requireIpRateLimit, requireRateLimit } from '@/server/auth/guards/require-rate-limit';
import {
  setAccessTokenCookie,
  setPendingEmailVerificationCookie,
  setRefreshTokenCookie,
} from '@/server/auth/lib/cookies';
import { getClientIp } from '@/server/auth/lib/get-client-ip';
import { userRepository } from '@/server/auth/repositories/user.repository';
import { type LoginInput, loginSchema } from '@/server/auth/schemas/login.schema';
import { login } from '@/server/auth/services/login.service';
import type { LoginResult } from '@/server/auth/types/action-results';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

export async function loginAction(input: LoginInput): Promise<ActionResult<LoginResult>> {
  const headerStore = await headers();
  const ipAddress = getClientIp(headerStore);

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
      await requireIpRateLimit(ipAddress, {
        key: `login:ip:${ipAddress}`,
        ...RATE_LIMITS.LOGIN_IP,
      });
      await requireRateLimit({
        key: `login:email:${validated.data.email}`,
        ...RATE_LIMITS.LOGIN_EMAIL,
      });

      const userAgent = headerStore.get('user-agent') ?? 'unknown';

      const { accessToken, refreshToken, user } = await login(validated.data, ipAddress, userAgent);

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

  return result.success
    ? { ...result, message: `Welcome back, ${result.data.user.firstName}!` }
    : result;
}
