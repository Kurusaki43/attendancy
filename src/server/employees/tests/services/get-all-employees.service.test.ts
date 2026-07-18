import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/employee.repository', () => ({
  employeeRepository: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
}));

const { employeeRepository } = await import('../../repositories/employee.repository');
const { BadRequestError } = await import('@/lib/errors/bad-request.error');
const { getAllEmployees } = await import('../../services/get-all-employees.service');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getAllEmployees', () => {
  it('returns employees and pagination metadata for a default query', async () => {
    const employees = [{ id: 'employee-1', employeeCode: 'EMP-001' }];
    vi.mocked(employeeRepository.findMany).mockResolvedValue(employees as never);
    vi.mocked(employeeRepository.count).mockResolvedValue(1);

    const result = await getAllEmployees({});

    expect(employeeRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ createdAt: 'desc' }],
        skip: 0,
        take: 10,
      }),
    );
    expect(result).toEqual({
      employees,
      pagination: expect.objectContaining({ page: 1, limit: 10, totalItems: 1 }),
    });
  });

  it('applies the employmentStatus filter when provided', async () => {
    vi.mocked(employeeRepository.findMany).mockResolvedValue([] as never);
    vi.mocked(employeeRepository.count).mockResolvedValue(0);

    await getAllEmployees({ employmentStatus: 'ACTIVE' });

    expect(employeeRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ employmentStatus: 'ACTIVE' }) }),
    );
  });

  it('applies the departmentId filter when provided', async () => {
    vi.mocked(employeeRepository.findMany).mockResolvedValue([] as never);
    vi.mocked(employeeRepository.count).mockResolvedValue(0);

    await getAllEmployees({ departmentId: 'dept-1' });

    expect(employeeRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ departmentId: 'dept-1' }) }),
    );
  });

  it('throws BadRequestError for an invalid sort value', async () => {
    const result = getAllEmployees({ sort: 'not-a-real-field' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    expect(employeeRepository.findMany).not.toHaveBeenCalled();
  });
});
