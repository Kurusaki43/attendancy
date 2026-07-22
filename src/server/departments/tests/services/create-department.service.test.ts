import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/department.repository', () => ({
  departmentRepository: {
    findByName: vi.fn(),
    findByCode: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  },
}));

const { departmentRepository } = await import('../../repositories/department.repository');
const { BadRequestError } = await import('@/lib/errors/bad-request.error');
const { ConflictError } = await import('@/lib/errors/conflict.error');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { createDepartment } = await import('../../services/create-department.service');

const input = {
  name: 'Engineering',
  code: 'ENG',
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(departmentRepository.findByName).mockResolvedValue(null);
  vi.mocked(departmentRepository.findByCode).mockResolvedValue(null);
  vi.mocked(departmentRepository.create).mockResolvedValue({ id: 'dept-1', ...input } as never);
});

describe('createDepartment', () => {
  it('creates the department when no parent is given', async () => {
    const result = await createDepartment(input);

    expect(departmentRepository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual({ id: 'dept-1', ...input });
  });

  it('throws ConflictError when the name is already taken', async () => {
    vi.mocked(departmentRepository.findByName).mockResolvedValue({ id: 'existing' } as never);

    const result = createDepartment(input);

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_ALREADY_EXISTS });
    expect(departmentRepository.create).not.toHaveBeenCalled();
  });

  it('throws ConflictError when the code is already taken', async () => {
    vi.mocked(departmentRepository.findByCode).mockResolvedValue({ id: 'existing' } as never);

    const result = createDepartment(input);

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({
      code: ERROR_CODES.DEPARTMENT_CODE_ALREADY_EXISTS,
    });
    expect(departmentRepository.create).not.toHaveBeenCalled();
  });

  it('throws NotFoundError when the parent department does not exist', async () => {
    vi.mocked(departmentRepository.findById).mockResolvedValue(null);

    const result = createDepartment({ ...input, parentId: 'missing-parent' });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_NOT_FOUND });
    expect(departmentRepository.create).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the parent department is inactive', async () => {
    vi.mocked(departmentRepository.findById).mockResolvedValue({
      id: 'parent-1',
      isActive: false,
    } as never);

    const result = createDepartment({ ...input, parentId: 'parent-1' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_NOT_ACTIVE });
    expect(departmentRepository.create).not.toHaveBeenCalled();
  });

  it('creates the department when the parent is active', async () => {
    vi.mocked(departmentRepository.findById).mockResolvedValue({
      id: 'parent-1',
      isActive: true,
    } as never);

    await createDepartment({ ...input, parentId: 'parent-1' });

    expect(departmentRepository.create).toHaveBeenCalledWith({ ...input, parentId: 'parent-1' });
  });
});
