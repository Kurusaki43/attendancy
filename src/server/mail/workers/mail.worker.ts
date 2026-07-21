import { createWorker } from '@/infrastructure/workers/base.worker';
import { MailService } from '@/server/mail/services/mail.service';

export const emailWorker = createWorker('email', {
  'send-verification-email': (data) => MailService.sendVerificationEmail(data),
  'send-welcome': (data) => MailService.sendWelcomeEmail(data),
  'send-reset-password': (data) => MailService.sendResetPasswordEmail(data),
  'send-employee-invite': (data) => MailService.sendEmployeeInviteEmail(data),
});
