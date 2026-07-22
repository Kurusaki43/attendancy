import type { Prisma } from '@/generated/prisma/client';
import type { EMPLOYEE_INCLUDE } from '@/server/employees/repositories/employee.repository';

export type EmployeeWithRelations = Prisma.EmployeeGetPayload<{
  include: typeof EMPLOYEE_INCLUDE;
}>;

export type CreateEmployeeServiceResult = EmployeeWithRelations;

export type UpdateEmployeeServiceResult = EmployeeWithRelations;

export type GetEmployeeServiceResult = EmployeeWithRelations;

export type DeleteEmployeeServiceResult = void;

export type GetEmployeeStatsServiceResult = {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
};
