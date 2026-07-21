import type { EmployeeResult } from '@/server/employees/types';

export type AttendanceEmployeeOption = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  position: string | null;
  department: string | null;
  employeeCode: string;
  employmentStatus: EmployeeResult['employmentStatus'];
  userStatus: EmployeeResult['user']['status'];
  hireDate: EmployeeResult['hireDate'];
};

export function toEmployeeOption(employee: EmployeeResult): AttendanceEmployeeOption {
  return {
    id: employee.id,
    firstName: employee.user.firstName,
    lastName: employee.user.lastName,
    avatar: employee.user.avatar,
    position: employee.position?.title ?? null,
    department: employee.department?.name ?? null,
    employeeCode: employee.employeeCode,
    employmentStatus: employee.employmentStatus,
    userStatus: employee.user.status,
    hireDate: employee.hireDate,
  };
}
