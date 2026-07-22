import { randomBytes } from 'crypto';
import ms from 'ms';

import { env } from '@/lib/env/env';
import { hashOtp } from '@/server/auth/lib/otp';
import { otpRepository } from '@/server/auth/repositories/otp.repository';
import { emailQueueService } from '@/server/mail/services/email-queue.service';
import { humanizeDuration } from '@/shared/utils/humanize-duration';

export type SendEmployeeInviteParams = {
  userId: string;
  firstName: string;
  email: string;
};

export async function sendEmployeeInvite({
  userId,
  firstName,
  email,
}: SendEmployeeInviteParams): Promise<void> {
  await otpRepository.invalidateActiveOtps({ userId, type: 'EMPLOYEE_INVITE' });

  const token = randomBytes(32).toString('hex');
  const codeHash = await hashOtp(token);

  const otp = await otpRepository.create({
    user: { connect: { id: userId } },
    type: 'EMPLOYEE_INVITE',
    codeHash,
    expiresAt: new Date(Date.now() + ms(env.INVITATION_LINK_EXPIRED_IN)),
  });

  const inviteUrl = `${env.APP_URL}/accept-invite?id=${otp.id}&token=${token}`;

  await emailQueueService.sendEmployeeInviteEmail({
    to: email,
    firstName,
    inviteUrl,
    expiresIn: humanizeDuration(env.INVITATION_LINK_EXPIRED_IN),
  });
}
