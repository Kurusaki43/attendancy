import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';

import { departmentRepository } from '../repositories/department.repository';
import type { GetDepartmentServiceResult } from '../types';

export async function getDepartment(departmentId: string): Promise<GetDepartmentServiceResult> {
  const department = await departmentRepository.findById(departmentId);

  if (!department) {
    throw new NotFoundError(ERROR_CODES.DEPARTMENT_NOT_FOUND, 'Department not found!');
  }

  return department;
}
