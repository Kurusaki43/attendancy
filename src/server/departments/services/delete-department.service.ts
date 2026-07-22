import { ConflictError } from '@/lib/errors/conflict.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { departmentRepository } from '@/server/departments/repositories/department.repository';
import type { DeleteDepartmentServiceResult } from '@/server/departments/types';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';

export async function deleteDepartment(
  departmentId: string,
): Promise<DeleteDepartmentServiceResult> {
  const department = await departmentRepository.findById(departmentId);

  if (!department) {
    throw new NotFoundError(ERROR_CODES.DEPARTMENT_NOT_FOUND, 'Department not found!');
  }

  const childrenCount = await departmentRepository.count({ parentId: departmentId });

  if (childrenCount > 0) {
    throw new ConflictError(
      ERROR_CODES.DEPARTMENT_HAS_CHILDREN,
      `This department has ${childrenCount} sub-department${childrenCount === 1 ? '' : 's'} and cannot be deleted until they are moved or removed.`,
    );
  }

  const employeeCount = await employeeRepository.count({ departmentId });

  if (employeeCount > 0) {
    throw new ConflictError(
      ERROR_CODES.DEPARTMENT_HAS_EMPLOYEES,
      `This department has ${employeeCount} employee${employeeCount === 1 ? '' : 's'} and cannot be deleted until they are reassigned or removed.`,
    );
  }

  await departmentRepository.delete(departmentId);
}
