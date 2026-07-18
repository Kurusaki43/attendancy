import type { PaginationMeta } from '@/shared/types/api-feature';

export type EmployeeUserResult = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  avatar: string | null;
};

export type EmployeeManagerResult = {
  id: string;
  employeeCode: string;
  user: {
    firstName: string;
    lastName: string;
  };
};

export type EmployeeResult = {
  id: string;
  employeeCode: string;
  phone: string | null;
  hireDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: EmployeeUserResult;
  department: {
    id: string;
    name: string;
    code: string;
    icon: string | null;
    color: string | null;
  } | null;
  position: {
    id: string;
    title: string;
    code: string;
  } | null;
  manager: EmployeeManagerResult | null;
};

export type CreateEmployeeActionResult = EmployeeResult;

export type UpdateEmployeeActionResult = EmployeeResult;

export type GetEmployeeActionResult = EmployeeResult;

export type GetAllEmployeesActionResult = {
  employees: EmployeeResult[];
  pagination: PaginationMeta;
};

export type DeleteEmployeeActionResult = void;
