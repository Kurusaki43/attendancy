import { departmentRepository } from '@/server/departments/repositories/department.repository';
import type { GetDepartmentStatsServiceResult } from '@/server/departments/types';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';

export async function getDepartmentStats(): Promise<GetDepartmentStatsServiceResult> {
  const [totalDepartments, activeDepartments, totalEmployees] = await Promise.all([
    departmentRepository.count(),
    departmentRepository.count({ isActive: true }),
    employeeRepository.count(),
  ]);

  const inactiveDepartments = totalDepartments - activeDepartments;

  const averageDepartmentSize =
    totalDepartments > 0 ? Math.round((totalEmployees / totalDepartments) * 10) / 10 : 0;

  return { totalDepartments, activeDepartments, inactiveDepartments, averageDepartmentSize };
}
