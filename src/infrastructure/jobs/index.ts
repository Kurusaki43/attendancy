import type {
  SendResetPassword,
  SendVerificationEmail,
  SendWelcome,
} from '@/features/mail/mail.service';

export interface JobMap {
  email: {
    'send-verification-email': SendVerificationEmail;
    'send-welcome': SendWelcome;
    'send-reset-password': SendResetPassword;
  };
}
