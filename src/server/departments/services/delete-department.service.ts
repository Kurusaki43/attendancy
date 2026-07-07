import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import type { DeleteDepartmentServiceResult } from '@/server/departments/types';

import { departmentRepository } from '../repositories/department.repository';

export async function deleteDepartment(
  departmentId: string,
): Promise<DeleteDepartmentServiceResult> {
  const department = await departmentRepository.findById(departmentId);

  if (!department) {
    throw new NotFoundError(ERROR_CODES.DEPARTMENT_NOT_FOUND, 'Department not found!');
  }

  await departmentRepository.delete(departmentId);
}
