'use server';

import { z } from 'zod';

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
  const validated = loginSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      message: 'Validation error.',
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  try {
    const { accessToken, refreshToken, user } = await login(validated.data);

    await Promise.all([setAccessTokenCookie(accessToken), setRefreshTokenCookie(refreshToken)]);

    return {
      success: true,
      message: `Welcome back, ${user.firstName}!`,
      data: {
        user,
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_NOT_VERIFIED') {
      const user = await userRepository.findByEmail(validated.data.email);

      if (user) {
        await setPendingEmailVerificationCookie(user.id);
      }

      return {
        success: false,
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Please verify your email first.',
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong.',
    };
  }
}
