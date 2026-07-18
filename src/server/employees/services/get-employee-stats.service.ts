import { employeeRepository } from '@/server/employees/repositories/employee.repository';
import type { GetEmployeeStatsServiceResult } from '@/server/employees/types';

export async function getEmployeeStats(): Promise<GetEmployeeStatsServiceResult> {
  const [totalEmployees, activeEmployees, onLeaveEmployees, inactiveEmployees] = await Promise.all([
    employeeRepository.count(),
    employeeRepository.count({ employmentStatus: 'ACTIVE' }),
    employeeRepository.count({ employmentStatus: 'ON_LEAVE' }),
    employeeRepository.count({ employmentStatus: 'TERMINATED' }),
  ]);

  return { totalEmployees, activeEmployees, onLeaveEmployees, inactiveEmployees };
}
