import type { DepartmentUncheckedUpdateInput } from '@/generated/prisma/models';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ConflictError } from '@/lib/errors/conflict.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { departmentRepository } from '@/server/departments/repositories/department.repository';
import type { UpdateDepartmentServiceResult } from '@/server/departments/types';

export async function updateDepartment(
  departmentId: string,
  departmentInput: DepartmentUncheckedUpdateInput,
): Promise<UpdateDepartmentServiceResult> {
  const department = await departmentRepository.findById(departmentId);

  if (!department) {
    throw new NotFoundError(ERROR_CODES.DEPARTMENT_NOT_FOUND, 'Department not found!');
  }

  if (typeof departmentInput.code === 'string') {
    const departmentWithCode = await departmentRepository.findByCode(departmentInput.code);

    if (departmentWithCode && departmentWithCode.id !== departmentId) {
      throw new ConflictError(
        ERROR_CODES.DEPARTMENT_CODE_ALREADY_EXISTS,
        'Department code already in use!',
      );
    }
  }

  if (typeof departmentInput.parentId === 'string') {
    if (departmentInput.parentId === departmentId) {
      throw new BadRequestError(
        ERROR_CODES.DEPARTMENT_INVALID_PARENT,
        'A department cannot be its own parent.',
      );
    }

    const parent = await departmentRepository.findById(departmentInput.parentId);

    if (!parent) {
      throw new NotFoundError(ERROR_CODES.DEPARTMENT_NOT_FOUND, 'Parent department not found!');
    }

    let ancestor = parent;

    while (ancestor.parentId) {
      if (ancestor.parentId === departmentId) {
        throw new BadRequestError(
          ERROR_CODES.DEPARTMENT_INVALID_PARENT,
          'A department cannot be a parent of its own ancestor.',
        );
      }

      const nextAncestor = await departmentRepository.findById(ancestor.parentId);

      if (!nextAncestor) {
        break;
      }

      ancestor = nextAncestor;
    }
  }

  return await departmentRepository.update(departmentId, departmentInput);
}
