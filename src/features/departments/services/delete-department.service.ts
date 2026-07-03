import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';

import { departmentRepository } from '../department.repository';
import type { DeleteDepartmentServiceResult } from '../types';

export async function deleteDepartment(
  departmentId: string,
): Promise<DeleteDepartmentServiceResult> {
  const department = await departmentRepository.findById(departmentId);

  if (!department) {
    throw new NotFoundError(ERROR_CODES.DEPARTMENT_NOT_FOUND, 'Department not found!');
  }

  await departmentRepository.delete(departmentId);
}
