import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/employee.repository', () => ({
  employeeRepository: {
    count: vi.fn(),
    findByEmployeeCode: vi.fn(),
  },
}));

const { employeeRepository } = await import('../../repositories/employee.repository');
const { generateEmployeeCode } = await import('../../services/generate-employee-code.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('generateEmployeeCode', () => {
  it('formats the next code from the current employee count', async () => {
    vi.mocked(employeeRepository.count).mockResolvedValue(4);
    vi.mocked(employeeRepository.findByEmployeeCode).mockResolvedValue(null);

    const code = await generateEmployeeCode();

    expect(code).toBe('EMP-00005');
    expect(employeeRepository.findByEmployeeCode).toHaveBeenCalledWith('EMP-00005');
  });

  it('walks forward past already-taken codes to avoid duplicates', async () => {
    vi.mocked(employeeRepository.count).mockResolvedValue(4);
    vi.mocked(employeeRepository.findByEmployeeCode)
      .mockResolvedValueOnce({ id: 'existing' } as never)
      .mockResolvedValueOnce({ id: 'existing' } as never)
      .mockResolvedValueOnce(null);

    const code = await generateEmployeeCode();

    expect(code).toBe('EMP-00007');
    expect(employeeRepository.findByEmployeeCode).toHaveBeenNthCalledWith(1, 'EMP-00005');
    expect(employeeRepository.findByEmployeeCode).toHaveBeenNthCalledWith(2, 'EMP-00006');
    expect(employeeRepository.findByEmployeeCode).toHaveBeenNthCalledWith(3, 'EMP-00007');
  });
});
