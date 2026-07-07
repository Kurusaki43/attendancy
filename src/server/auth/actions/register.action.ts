'use server';

import { z } from 'zod';

import {
  type RegisterFormInput,
  registerFormSchema,
} from '@/features/auth/schemas/register.schema';
import { verifyCaptcha } from '@/lib/captcha';
import { register } from '@/server/auth/services/register.service';
import type { ActionResult } from '@/shared/types/action.types';
import { runAction } from '@/shared/utils/run-action';

import { setPendingEmailVerificationCookie } from '../lib/cookies';

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

  const result = await runAction(async () => {
    const user = await register(validated.data);
    await setPendingEmailVerificationCookie(user.id);
    return null;
  });

  return result.success
    ? { ...result, message: 'Account created successfully. Please verify your email.' }
    : result;
}
