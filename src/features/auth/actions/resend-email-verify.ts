'use server';

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
    const message = error instanceof Error ? error.message : 'Failed to resend verification code';

    return {
      success: false,
      message,
    };
  }
}
