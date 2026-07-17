import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/employee.repository', () => ({
  employeeRepository: {
    findById: vi.fn(),
  },
}));

const { employeeRepository } = await import('../../repositories/employee.repository');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { getEmployee } = await import('../../services/get-employee.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getEmployee', () => {
  it('returns the employee when it exists', async () => {
    const employee = { id: 'employee-1', employeeCode: 'EMP-001' };
    vi.mocked(employeeRepository.findById).mockResolvedValue(employee as never);

    const result = await getEmployee('employee-1');

    expect(employeeRepository.findById).toHaveBeenCalledWith('employee-1');
    expect(result).toEqual(employee);
  });

  it('throws NotFoundError when the employee does not exist', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue(null);

    const result = getEmployee('missing-id');

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_NOT_FOUND });
  });
});
