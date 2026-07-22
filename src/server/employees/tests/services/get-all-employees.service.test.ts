import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../repositories/employee.repository', () => ({
  employeeRepository: {
    findMany: vi.fn(),
    count: vi.fn(),
  },
}));

vi.mock('../../../departments/repositories/department.repository', () => ({
  departmentRepository: {
    findAllForEmployeeRollup: vi.fn(),
  },
}));

const { employeeRepository } = await import('../../repositories/employee.repository');
const { departmentRepository } = await import('../../../departments/repositories/department.repository');
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

  it('applies the accountStatus filter as a nested user relation filter', async () => {
    vi.mocked(employeeRepository.findMany).mockResolvedValue([] as never);
    vi.mocked(employeeRepository.count).mockResolvedValue(0);

    await getAllEmployees({ accountStatus: 'INVITED' });

    expect(employeeRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ user: { status: 'INVITED' } }),
      }),
    );
  });

  it('searches by employeeCode/phone alongside the user’s name and email', async () => {
    vi.mocked(employeeRepository.findMany).mockResolvedValue([] as never);
    vi.mocked(employeeRepository.count).mockResolvedValue(0);

    await getAllEmployees({ search: 'jane' });

    expect(employeeRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { employeeCode: { contains: 'jane', mode: 'insensitive' } },
            { phone: { contains: 'jane', mode: 'insensitive' } },
            { user: { firstName: { contains: 'jane', mode: 'insensitive' } } },
            { user: { lastName: { contains: 'jane', mode: 'insensitive' } } },
            { user: { email: { contains: 'jane', mode: 'insensitive' } } },
          ],
        }),
      }),
    );
  });

  it('sorts by the user’s first/last name via a nested relation orderBy', async () => {
    vi.mocked(employeeRepository.findMany).mockResolvedValue([] as never);
    vi.mocked(employeeRepository.count).mockResolvedValue(0);

    await getAllEmployees({ sort: 'name' });

    expect(employeeRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ user: { firstName: 'asc' } }, { user: { lastName: 'asc' } }],
      }),
    );
  });

  it('sorts by name descending when sort=-name', async () => {
    vi.mocked(employeeRepository.findMany).mockResolvedValue([] as never);
    vi.mocked(employeeRepository.count).mockResolvedValue(0);

    await getAllEmployees({ sort: '-name' });

    expect(employeeRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ user: { firstName: 'desc' } }, { user: { lastName: 'desc' } }],
      }),
    );
  });

  it('sorts by employeeCode using the flat column', async () => {
    vi.mocked(employeeRepository.findMany).mockResolvedValue([] as never);
    vi.mocked(employeeRepository.count).mockResolvedValue(0);

    await getAllEmployees({ sort: '-employeeCode' });

    expect(employeeRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: [{ employeeCode: 'desc' }] }),
    );
  });

  it('applies the departmentId filter across the department and its descendants', async () => {
    vi.mocked(employeeRepository.findMany).mockResolvedValue([] as never);
    vi.mocked(employeeRepository.count).mockResolvedValue(0);
    vi.mocked(departmentRepository.findAllForEmployeeRollup).mockResolvedValue([
      { id: 'dept-1', parentId: null, _count: { employees: 0 } },
      { id: 'dept-2', parentId: 'dept-1', _count: { employees: 0 } },
    ] as never);

    await getAllEmployees({ departmentId: 'dept-1' });

    expect(employeeRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ departmentId: { in: ['dept-1', 'dept-2'] } }),
      }),
    );
  });

  it('throws BadRequestError for an invalid sort value', async () => {
    const result = getAllEmployees({ sort: 'not-a-real-field' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    expect(employeeRepository.findMany).not.toHaveBeenCalled();
  });
});
