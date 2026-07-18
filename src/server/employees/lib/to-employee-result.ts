import type { EmployeeResult } from '@/server/employees/types/action-results';
import type { EmployeeWithRelations } from '@/server/employees/types/service-results';

export function toEmployeeResult(employee: EmployeeWithRelations): EmployeeResult {
  return {
    id: employee.id,
    employeeCode: employee.employeeCode,
    phone: employee.phone,
    hireDate: employee.hireDate,
    gender: employee.gender,
    birthDate: employee.birthDate,
    address: employee.address,
    isActive: employee.isActive,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
    user: employee.user,
    department: employee.department,
    position: employee.position,
    manager: employee.manager,
  };
}
