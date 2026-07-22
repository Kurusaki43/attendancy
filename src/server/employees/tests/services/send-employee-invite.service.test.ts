import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/server/auth/repositories/otp.repository', () => ({
  otpRepository: {
    invalidateActiveOtps: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('@/server/auth/lib/otp', () => ({
  hashOtp: vi.fn().mockResolvedValue('hashed-token'),
}));

vi.mock('@/server/mail/services/email-queue.service', () => ({
  emailQueueService: {
    sendEmployeeInviteEmail: vi.fn(),
  },
}));

const { otpRepository } = await import('@/server/auth/repositories/otp.repository');
const { emailQueueService } = await import('@/server/mail/services/email-queue.service');
const { sendEmployeeInvite } = await import('../../services/send-employee-invite.service');

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(otpRepository.invalidateActiveOtps).mockResolvedValue({ count: 1 } as never);
  vi.mocked(otpRepository.create).mockResolvedValue({ id: 'otp-1' } as never);
});

describe('sendEmployeeInvite', () => {
  it('invalidates any active invite OTPs for the user before issuing a new one', async () => {
    await sendEmployeeInvite({ userId: 'user-1', firstName: 'Ada', email: 'ada@example.com' });

    expect(otpRepository.invalidateActiveOtps).toHaveBeenCalledWith({
      userId: 'user-1',
      type: 'EMPLOYEE_INVITE',
    });
  });

  it('creates a new EMPLOYEE_INVITE otp for the user', async () => {
    await sendEmployeeInvite({ userId: 'user-1', firstName: 'Ada', email: 'ada@example.com' });

    expect(otpRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        user: { connect: { id: 'user-1' } },
        type: 'EMPLOYEE_INVITE',
        codeHash: 'hashed-token',
      }),
    );
  });

  it('sends the invite email with a link containing the new otp id', async () => {
    await sendEmployeeInvite({ userId: 'user-1', firstName: 'Ada', email: 'ada@example.com' });

    expect(emailQueueService.sendEmployeeInviteEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'ada@example.com',
        firstName: 'Ada',
        inviteUrl: expect.stringContaining('otp-1'),
      }),
    );
  });
});
