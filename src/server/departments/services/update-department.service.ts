import type { DepartmentUpdateInput } from '@/generated/prisma/models';
import { ConflictError } from '@/lib/errors/conflict.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { departmentRepository } from '@/server/departments/repositories/department.repository';
import type { UpdateDepartmentServiceResult } from '@/server/departments/types';

export async function updateDepartment(
  departmentId: string,
  departmentInput: DepartmentUpdateInput,
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

  return await departmentRepository.update(departmentId, departmentInput);
}
