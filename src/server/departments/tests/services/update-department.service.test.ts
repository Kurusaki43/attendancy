import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/department.repository', () => ({
  departmentRepository: {
    findById: vi.fn(),
    findByCode: vi.fn(),
    update: vi.fn(),
  },
}));

const { departmentRepository } = await import('../../repositories/department.repository');
const { BadRequestError } = await import('@/lib/errors/bad-request.error');
const { ConflictError } = await import('@/lib/errors/conflict.error');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { updateDepartment } = await import('../../services/update-department.service');

const existingDepartment = { id: 'dept-1', parentId: null };

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(departmentRepository.findById).mockResolvedValue(existingDepartment as never);
  vi.mocked(departmentRepository.update).mockResolvedValue({ id: 'dept-1' } as never);
});

describe('updateDepartment', () => {
  it('throws NotFoundError when the department does not exist', async () => {
    vi.mocked(departmentRepository.findById).mockResolvedValue(null);

    const result = updateDepartment('missing-id', { name: 'New name' });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_NOT_FOUND });
    expect(departmentRepository.update).not.toHaveBeenCalled();
  });

  it('throws ConflictError when the new code belongs to a different department', async () => {
    vi.mocked(departmentRepository.findByCode).mockResolvedValue({ id: 'dept-2' } as never);

    const result = updateDepartment('dept-1', { code: 'ENG' });

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.DEPARTMENT_CODE_ALREADY_EXISTS,
    });
    expect(departmentRepository.update).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when a department is set as its own parent', async () => {
    const result = updateDepartment('dept-1', { parentId: 'dept-1' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_INVALID_PARENT });
    expect(departmentRepository.update).not.toHaveBeenCalled();
  });

  it('throws NotFoundError when the new parent does not exist', async () => {
    vi.mocked(departmentRepository.findById).mockImplementation(((id: string) =>
      Promise.resolve(id === 'dept-1' ? existingDepartment : null)) as never);

    const result = updateDepartment('dept-1', { parentId: 'missing-parent' });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_NOT_FOUND });
    expect(departmentRepository.update).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the new parent is inactive', async () => {
    vi.mocked(departmentRepository.findById).mockImplementation(((id: string) =>
      Promise.resolve(
        id === 'dept-1' ? existingDepartment : { id: 'parent-1', isActive: false, parentId: null },
      )) as never);

    const result = updateDepartment('dept-1', { parentId: 'parent-1' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_NOT_ACTIVE });
    expect(departmentRepository.update).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the new parent is a descendant of this department', async () => {
    // dept-1 -> child-1 (parentId: dept-1); attempting to set dept-1's parent to child-1.
    vi.mocked(departmentRepository.findById).mockImplementation(((id: string) => {
      if (id === 'dept-1') return Promise.resolve(existingDepartment);
      if (id === 'child-1') {
        return Promise.resolve({ id: 'child-1', isActive: true, parentId: 'dept-1' });
      }
      return Promise.resolve(null);
    }) as never);

    const result = updateDepartment('dept-1', { parentId: 'child-1' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_INVALID_PARENT });
    expect(departmentRepository.update).not.toHaveBeenCalled();
  });

  it('updates the department when the new parent is active and not a descendant', async () => {
    vi.mocked(departmentRepository.findById).mockImplementation(((id: string) =>
      Promise.resolve(
        id === 'dept-1' ? existingDepartment : { id: 'parent-1', isActive: true, parentId: null },
      )) as never);

    await updateDepartment('dept-1', { parentId: 'parent-1' });

    expect(departmentRepository.update).toHaveBeenCalledWith('dept-1', { parentId: 'parent-1' });
  });
});
