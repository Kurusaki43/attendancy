import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/employee.repository', () => ({
  employeeRepository: {
    count: vi.fn(),
  },
}));

const { employeeRepository } = await import('../../repositories/employee.repository');
const { getEmployeeStats } = await import('../../services/get-employee-stats.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getEmployeeStats', () => {
  it('returns total, active, and inactive employee counts', async () => {
    vi.mocked(employeeRepository.count).mockResolvedValueOnce(10);
    vi.mocked(employeeRepository.count).mockResolvedValueOnce(7);
    vi.mocked(employeeRepository.count).mockResolvedValueOnce(3);

    const result = await getEmployeeStats();

    expect(employeeRepository.count).toHaveBeenNthCalledWith(1);
    expect(employeeRepository.count).toHaveBeenNthCalledWith(2, { employmentStatus: 'ACTIVE' });
    expect(employeeRepository.count).toHaveBeenNthCalledWith(3, {
      employmentStatus: 'TERMINATED',
    });
    expect(result).toEqual({
      totalEmployees: 10,
      activeEmployees: 7,
      inactiveEmployees: 3,
    });
  });
});
