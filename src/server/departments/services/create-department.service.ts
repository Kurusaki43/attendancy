import type { DepartmentCreateInput } from '@/generated/prisma/models';
import { ConflictError } from '@/lib/errors/conflict.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { departmentRepository } from '@/server/departments/repositories/department.repository';
import type { CreateDepartmentServiceResult } from '@/server/departments/types';

export async function createDepartment(
  departmentInput: Omit<DepartmentCreateInput, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<CreateDepartmentServiceResult> {
  const department = await departmentRepository.findByName(departmentInput.name);

  if (department) {
    throw new ConflictError(ERROR_CODES.DEPARTMENT_ALREADY_EXISTS, 'Department already exist!');
  }

  return await departmentRepository.create(departmentInput);
}
