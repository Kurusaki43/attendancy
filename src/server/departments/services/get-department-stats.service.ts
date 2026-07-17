import { departmentRepository } from '@/server/departments/repositories/department.repository';
import type { GetDepartmentStatsServiceResult } from '@/server/departments/types';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';

export async function getDepartmentStats(): Promise<GetDepartmentStatsServiceResult> {
  const [totalDepartments, totalEmployees] = await Promise.all([
    departmentRepository.count(),
    employeeRepository.count(),
  ]);

  const averageDepartmentSize =
    totalDepartments > 0 ? Math.round((totalEmployees / totalDepartments) * 10) / 10 : 0;

  return { totalDepartments, totalEmployees, averageDepartmentSize };
}
