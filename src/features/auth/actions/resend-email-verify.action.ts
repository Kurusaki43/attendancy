'use server';

import { AppError } from '@/lib/errors/app.error';
import { type ActionResult } from '@/types/action.types';

import { resendEmailVerification } from '../services/resend-email-verification.service';

export async function resendVerificationOtpAction(email: string): Promise<ActionResult<null>> {
  try {
    await resendEmailVerification(email);

    return {
      success: true,
      message: 'Code resent successfully',
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
      message: 'Failed to resend verification code.',
    };
  }
}
