'use server';

import { z } from 'zod';

import type { ActionResult } from '@/types/action.types';

import { type RegisterInput, registerSchema } from '../schemas/register.schema';
import { register } from '../services/register.service';
import type { RegisterResult } from '../types/auth.types';

export async function registerAction(input: RegisterInput): Promise<ActionResult<RegisterResult>> {
  const validated = registerSchema.safeParse(input);

  if (!validated.success) {
    return {
      success: false,
      errors: z.flattenError(validated.error).fieldErrors,
    };
  }

  try {
    const user = await register(validated.data);

    return {
      success: true,
      message: 'Account created successfully.',
      data: {
        email: user.email,
        userId: user.id,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong.',
    };
  }
}
