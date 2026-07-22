import type { DepartmentUncheckedCreateInput } from '@/generated/prisma/models';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ConflictError } from '@/lib/errors/conflict.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { departmentRepository } from '@/server/departments/repositories/department.repository';
import type { CreateDepartmentServiceResult } from '@/server/departments/types';

export async function createDepartment(
  departmentInput: Omit<DepartmentUncheckedCreateInput, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<CreateDepartmentServiceResult> {
  const department = await departmentRepository.findByName(departmentInput.name);

  if (department) {
    throw new ConflictError(ERROR_CODES.DEPARTMENT_ALREADY_EXISTS, 'Department already exist!');
  }

  const departmentWithCode = await departmentRepository.findByCode(departmentInput.code);

  if (departmentWithCode) {
    throw new ConflictError(
      ERROR_CODES.DEPARTMENT_CODE_ALREADY_EXISTS,
      'Department code already in use!',
    );
  }

  if (typeof departmentInput.parentId === 'string') {
    const parent = await departmentRepository.findById(departmentInput.parentId);

    if (!parent) {
      throw new NotFoundError(ERROR_CODES.DEPARTMENT_NOT_FOUND, 'Parent department not found!');
    }

    if (!parent.isActive) {
      throw new BadRequestError(
        ERROR_CODES.DEPARTMENT_NOT_ACTIVE,
        'An inactive department cannot be assigned as a parent.',
      );
    }
  }

  return await departmentRepository.create(departmentInput);
}
