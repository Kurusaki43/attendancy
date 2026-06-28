import { MailService } from '@/features/mail/mail.service';
import { createWorker } from '@/infrastructure/workers/base.worker';

type SendWelcomeEmail = {
  to: string;
  name: string;
};

type SendResetPassword = {
  to: string;
  token: string;
};

export const emailWorker = createWorker<SendWelcomeEmail | SendResetPassword>(
  'email',
  async (job) => {
    switch (job.name) {
      case 'send-welcome':
        return MailService.sendWelcomeEmail(job.data as SendWelcomeEmail);

      case 'send-reset-password':
        return MailService.sendResetPasswordEmail(job.data as SendResetPassword);

      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  },
);
