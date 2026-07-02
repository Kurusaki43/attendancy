'use server';

import { z } from 'zod';

import {
  type RegisterFormInput,
  registerFormSchema,
} from '@/features/auth/schemas/register.schema';
import { register } from '@/features/auth/services/register.service';
import { AppError } from '@/lib/errors/ app.error';
import type { ActionResult } from '@/types/action.types';

import { setPendingEmailVerificationCookie } from '../lib/cookies';
import { verifyCaptcha } from '../services/captcha.service';

export async function registerAction(input: RegisterFormInput): Promise<ActionResult<null>> {
  const validated = registerFormSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  const isHuman = await verifyCaptcha(validated.data.captchaToken);

  if (!isHuman) {
    return {
      success: false,
      message: 'Captcha verification failed.',
    };
  }

  try {
    const user = await register(validated.data);

    await setPendingEmailVerificationCookie(user.id);

    return {
      success: true,
      message: 'Account created successfully. Please verify your email.',
      data: null,
    };
  } catch (error) {
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
