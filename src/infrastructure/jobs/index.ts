import type {
  SendEmployeeInvite,
  SendResetPassword,
  SendVerificationEmail,
  SendWelcome,
} from '@/server/mail/services/mail.service';

export interface JobMap {
  email: {
    'send-verification-email': SendVerificationEmail;
    'send-welcome': SendWelcome;
    'send-reset-password': SendResetPassword;
    'send-employee-invite': SendEmployeeInvite;
  };
}
