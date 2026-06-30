'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import {
  type RegisterFormInput,
  registerFormSchema,
} from '@/features/auth/schemas/register.schema';
import { register } from '@/features/auth/services/register.service';
import { env } from '@/lib/env';
import type { ActionResult } from '@/types/action.types';

const FIFTEEN_MINUTES = 60 * 15;

export async function registerAction(input: RegisterFormInput): Promise<ActionResult<null>> {
  const validated = registerFormSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  try {
    const user = await register(validated.data);

    const cookieStore = await cookies();

    cookieStore.set('pending_email_verification', user.id, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: FIFTEEN_MINUTES,
      path: '/',
    });

    return {
      success: true,
      message: 'Account created successfully. Please verify your email.',
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong.',
    };
  }
}
