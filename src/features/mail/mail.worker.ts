import { createWorker } from '@/infrastructure/workers/base.worker';

import {
  MailService,
  type SendResetPassword,
  type SendVerificationEmail,
  type SendWelcome,
} from './mail.service';

type EmailJobData = SendVerificationEmail | SendWelcome | SendResetPassword;

export const emailWorker = createWorker<EmailJobData>('email', async (job) => {
  switch (job.name) {
    case 'send-verification-email':
      return MailService.sendVerificationEmail(job.data as SendVerificationEmail);
    case 'send-welcome':
      return MailService.sendWelcomeEmail(job.data as SendWelcome);

    case 'send-reset-password':
      return MailService.sendResetPasswordEmail(job.data as SendResetPassword);
  }
});
