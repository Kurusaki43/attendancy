import type { PaginationMeta } from '@/shared/types/api-feature';

export type DepartmentResult = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  parentId: string | null;
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
