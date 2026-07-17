import type { PaginationMeta } from '@/shared/types/api-feature';

export type DepartmentResult = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  parentId: string | null;
  // Only populated by the list endpoint (get-all-departments includes it); create/update return
  // the raw Prisma row without relations, so this stays optional.
  parent?: {
    id: string;
    name: string;
    code: string;
    icon: string | null;
    color: string | null;
  } | null;
  // Only populated by the list endpoint — same reasoning as `parent`.
  employeeCount?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateDepartmentActionResult = DepartmentResult;

export type UpdateDepartmentActionResult = DepartmentResult;

export type GetDepartmentActionResult = DepartmentResult;

export type GetAllDepartmentsActionResult = {
  departments: DepartmentResult[];
  pagination: PaginationMeta;
};

export type DeleteDepartmentActionResult = void;

export type GetDepartmentStatsActionResult = {
  totalDepartments: number;
  totalEmployees: number;
  averageDepartmentSize: number;
};
