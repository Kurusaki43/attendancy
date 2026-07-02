'use server';

import { headers } from 'next/dist/server/request/headers';
import { z } from 'zod';

import { AppError } from '@/lib/errors/ app.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { UnauthorizedError } from '@/lib/errors/unauthorized.error';
import type { ActionResult } from '@/types/action.types';

import {
  setAccessTokenCookie,
  setPendingEmailVerificationCookie,
  setRefreshTokenCookie,
} from '../lib/cookies';
import { userRepository } from '../repositories/user.repository';
import { type LoginInput, loginSchema } from '../schemas/login.schema';
import { login } from '../services/login.service';
import type { LoginResult } from '../types/auth.types';

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

  try {
    const ipAddress = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const userAgent = headerStore.get('user-agent') ?? 'unknown';

    const { accessToken, refreshToken, user } = await login(validated.data, ipAddress, userAgent);

    await Promise.all([setAccessTokenCookie(accessToken), setRefreshTokenCookie(refreshToken)]);

    return {
      success: true,
      message: `Welcome back, ${user.firstName}!`,
      data: {
        user,
      },
    };
  } catch (error) {
    if (
      error instanceof UnauthorizedError &&
      error.code === ERROR_CODES.UNAUTHORIZED
    ) {
      const user = await userRepository.findByEmail(validated.data.email);

      if (user) {
        await setPendingEmailVerificationCookie(user.id);
      }

      return {
        success: false,
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Please verify your email first.',
      };
    }

    if (error instanceof AppError) {
      return {
        success: false,
        code: error.code,
        message: error.message,
      };
    }

    return {
      success: false,
      message: 'Something went wrong.',
    };
  }
}
