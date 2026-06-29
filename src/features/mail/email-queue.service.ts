import { emailQueue } from './mail.queue';
import type { SendVerificationEmail, SendWelcome } from './mail.service';

export const emailQueueService = {
  sendVerificationEmail(data: SendVerificationEmail) {
    return emailQueue.add('send-verification-email', data);
  },
  sendWelcomeEmail(data: SendWelcome) {
    return emailQueue.add('send-welcome', data);
  },
};
