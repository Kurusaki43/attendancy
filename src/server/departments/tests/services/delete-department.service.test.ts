import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/department.repository', () => ({
  departmentRepository: {
    findById: vi.fn(),
    count: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/server/employees/repositories/employee.repository', () => ({
  employeeRepository: {
    count: vi.fn(),
  },
}));

const { departmentRepository } = await import('../../repositories/department.repository');
const { employeeRepository } = await import('@/server/employees/repositories/employee.repository');
const { ConflictError } = await import('@/lib/errors/conflict.error');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { deleteDepartment } = await import('../../services/delete-department.service');

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(departmentRepository.findById).mockResolvedValue({ id: 'dept-1' } as never);
  vi.mocked(departmentRepository.count).mockResolvedValue(0);
  vi.mocked(departmentRepository.delete).mockResolvedValue({ id: 'dept-1' } as never);
  vi.mocked(employeeRepository.count).mockResolvedValue(0);
});

describe('deleteDepartment', () => {
  it('throws NotFoundError when the department does not exist', async () => {
    vi.mocked(departmentRepository.findById).mockResolvedValue(null);

    const result = deleteDepartment('missing-id');

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_NOT_FOUND });
    expect(departmentRepository.delete).not.toHaveBeenCalled();
  });

  it('throws ConflictError when the department has children', async () => {
    vi.mocked(departmentRepository.count).mockResolvedValue(2);

    const result = deleteDepartment('dept-1');

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_HAS_CHILDREN });
    expect(departmentRepository.count).toHaveBeenCalledWith({ parentId: 'dept-1' });
    expect(departmentRepository.delete).not.toHaveBeenCalled();
  });

  it('throws ConflictError when the department has employees', async () => {
    vi.mocked(employeeRepository.count).mockResolvedValue(3);

    const result = deleteDepartment('dept-1');

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_HAS_EMPLOYEES });
    expect(employeeRepository.count).toHaveBeenCalledWith({ departmentId: 'dept-1' });
    expect(departmentRepository.delete).not.toHaveBeenCalled();
  });

  it('deletes the department when it has no children or employees', async () => {
    await deleteDepartment('dept-1');

    expect(departmentRepository.delete).toHaveBeenCalledWith('dept-1');
  });
});
