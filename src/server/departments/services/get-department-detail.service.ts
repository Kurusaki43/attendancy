import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import type { DepartmentOverview } from '@/server/departments/lib/compute-department-overview';
import { computeDepartmentOverview } from '@/server/departments/lib/compute-department-overview';
import type { DepartmentWithRelations } from '@/server/departments/repositories/department.repository';
import { departmentRepository } from '@/server/departments/repositories/department.repository';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';

export type GetDepartmentDetailServiceResult = DepartmentWithRelations & {
  overview: DepartmentOverview;
};

export async function getDepartmentDetail(code: string): Promise<GetDepartmentDetailServiceResult> {
  const department = await departmentRepository.findByCodeWithRelations(code);

  if (!department) {
    throw new NotFoundError(ERROR_CODES.DEPARTMENT_NOT_FOUND, 'Department not found!');
  }

  const employees = await employeeRepository.findMany({ where: { departmentId: department.id } });

  return {
    ...department,
    overview: computeDepartmentOverview(employees, department.children.length),
  };
}
