import type { DepartmentUpdateInput } from '@/generated/prisma/models';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import type { UpdateDepartmentServiceResult } from '@/server/departments/types';

import { departmentRepository } from '../repositories/department.repository';

export async function updateDepartment(
  departmentId: string,
  departmentInput: DepartmentUpdateInput,
): Promise<UpdateDepartmentServiceResult> {
  const department = await departmentRepository.findById(departmentId);

  if (!department) {
    throw new NotFoundError(ERROR_CODES.DEPARTMENT_NOT_FOUND, 'Department not found!');
  }

  return await departmentRepository.update(departmentId, departmentInput);
}
