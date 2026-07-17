import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/employee.repository', () => ({
  employeeRepository: {
    findById: vi.fn(),
  },
}));

vi.mock('../../../auth/repositories/user.repository', () => ({
  userRepository: {
    delete: vi.fn(),
  },
}));

const { employeeRepository } = await import('../../repositories/employee.repository');
const { userRepository } = await import('../../../auth/repositories/user.repository');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { deleteEmployee } = await import('../../services/delete-employee.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('deleteEmployee', () => {
  it('deletes the user (cascading to the employee) when the employee exists', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue({
      id: 'employee-1',
      userId: 'user-1',
    } as never);
    vi.mocked(userRepository.delete).mockResolvedValue(undefined as never);

    await deleteEmployee('employee-1');

    expect(userRepository.delete).toHaveBeenCalledWith('user-1');
  });

  it('throws NotFoundError when the employee does not exist', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue(null);

    const result = deleteEmployee('missing-id');

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_NOT_FOUND });
    expect(userRepository.delete).not.toHaveBeenCalled();
  });
});
