import { emailQueue } from '@/server/mail/queues/mail.queue';

import type {
  SendEmployeeInvite,
  SendResetPassword,
  SendVerificationEmail,
  SendWelcome,
} from './mail.service';

export const emailQueueService = {
  sendVerificationEmail(data: SendVerificationEmail) {
    return emailQueue.add('send-verification-email', data);
  },
  sendWelcomeEmail(data: SendWelcome) {
    return emailQueue.add('send-welcome', data);
  },
  sendResetPasswordEmail(data: SendResetPassword) {
    return emailQueue.add('send-reset-password', data);
  },
  sendEmployeeInviteEmail(data: SendEmployeeInvite) {
    return emailQueue.add('send-employee-invite', data);
  },
};
