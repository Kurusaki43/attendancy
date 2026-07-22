import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/department.repository', () => ({
  departmentRepository: {
    findByCodeWithRelations: vi.fn(),
    findAllForEmployeeRollup: vi.fn(),
  },
}));

vi.mock('@/server/employees/repositories/employee.repository', () => ({
  employeeRepository: {
    findMany: vi.fn(),
  },
}));

const { departmentRepository } = await import('../../repositories/department.repository');
const { employeeRepository } = await import('@/server/employees/repositories/employee.repository');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { getDepartmentDetail } = await import('../../services/get-department-detail.service');

const DEPARTMENT = {
  id: 'dept-1',
  name: 'Engineering',
  code: 'ENG',
  description: null,
  icon: 'code-2',
  color: 'bg-purple-500',
  parentId: null,
  parent: null,
  children: [
    { id: 'dept-2', name: 'Backend' },
    { id: 'dept-3', name: 'Frontend' },
  ],
  isActive: true,
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-10'),
  _count: { employees: 2 },
};

const ALL_DEPARTMENTS = [
  { id: 'dept-1', parentId: null, _count: { employees: 0 } },
  { id: 'dept-2', parentId: 'dept-1', _count: { employees: 1 } },
  { id: 'dept-3', parentId: 'dept-1', _count: { employees: 1 } },
];

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(departmentRepository.findByCodeWithRelations).mockResolvedValue(DEPARTMENT as never);
  vi.mocked(departmentRepository.findAllForEmployeeRollup).mockResolvedValue(
    ALL_DEPARTMENTS as never,
  );
  vi.mocked(employeeRepository.findMany).mockResolvedValue([
    {
      employmentStatus: 'ACTIVE',
      user: { status: 'ACTIVE' },
      positionId: 'pos-1',
      managerId: null,
    },
    {
      employmentStatus: 'TERMINATED',
      user: { status: 'ACTIVE' },
      positionId: 'pos-2',
      managerId: 'emp-1',
    },
  ] as never);
});

describe('getDepartmentDetail', () => {
  it('throws NotFoundError when the department does not exist', async () => {
    vi.mocked(departmentRepository.findByCodeWithRelations).mockResolvedValue(null);

    const result = getDepartmentDetail('missing-code');

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_NOT_FOUND });
    expect(employeeRepository.findMany).not.toHaveBeenCalled();
  });

  it('fetches employees scoped to the department and every descendant', async () => {
    await getDepartmentDetail('ENG');

    expect(employeeRepository.findMany).toHaveBeenCalledWith({
      where: { departmentId: { in: ['dept-1', 'dept-2', 'dept-3'] } },
    });
  });

  it('scopes employees to just its own id when the department is a leaf', async () => {
    vi.mocked(departmentRepository.findByCodeWithRelations).mockResolvedValue({
      ...DEPARTMENT,
      children: [],
    } as never);
    vi.mocked(departmentRepository.findAllForEmployeeRollup).mockResolvedValue([
      ALL_DEPARTMENTS[0],
    ] as never);

    await getDepartmentDetail('ENG');

    expect(employeeRepository.findMany).toHaveBeenCalledWith({
      where: { departmentId: { in: ['dept-1'] } },
    });
  });

  it('returns the department merged with its computed overview', async () => {
    const result = await getDepartmentDetail('ENG');

    expect(result.id).toBe('dept-1');
    expect(result.overview).toEqual({
      totalEmployees: 2,
      activeEmployees: 1,
      childrenCount: 2,
      positionCount: 2,
      managerCount: 1,
    });
  });
});
