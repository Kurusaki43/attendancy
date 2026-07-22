import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/employee.repository', () => ({
  employeeRepository: {
    findById: vi.fn(),
  },
}));

vi.mock('../../services/send-employee-invite.service', () => ({
  sendEmployeeInvite: vi.fn(),
}));

const { employeeRepository } = await import('../../repositories/employee.repository');
const { sendEmployeeInvite } = await import('../../services/send-employee-invite.service');
const { BadRequestError } = await import('@/lib/errors/bad-request.error');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { resendEmployeeInvite } = await import('../../services/resend-employee-invite.service');

const invitedEmployee = {
  id: 'employee-1',
  userId: 'user-1',
  user: { id: 'user-1', firstName: 'Ada', email: 'ada@example.com', status: 'INVITED' },
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(employeeRepository.findById).mockResolvedValue(invitedEmployee as never);
});

describe('resendEmployeeInvite', () => {
  it('throws NotFoundError when the employee does not exist', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue(null);

    const result = resendEmployeeInvite('missing-id');

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_NOT_FOUND });
    expect(sendEmployeeInvite).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the employee has already accepted their invite', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue({
      ...invitedEmployee,
      user: { ...invitedEmployee.user, status: 'ACTIVE' },
    } as never);

    const result = resendEmployeeInvite('employee-1');

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_NOT_INVITED });
    expect(sendEmployeeInvite).not.toHaveBeenCalled();
  });

  it('re-sends the invite for a still-invited employee', async () => {
    await resendEmployeeInvite('employee-1');

    expect(sendEmployeeInvite).toHaveBeenCalledWith({
      userId: 'user-1',
      firstName: 'Ada',
      email: 'ada@example.com',
    });
  });
});
