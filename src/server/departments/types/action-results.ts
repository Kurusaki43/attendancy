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
  // Only populated by the list endpoint — same reasoning as `parent`. Direct employees only.
  employeeCount?: number;
  // Only populated by the list endpoint. Own employeeCount for a leaf department, or the summed
  // employeeCount across every descendant for a department with children.
  totalEmployeeCount?: number;
  // Only populated by the list endpoint — same reasoning as `parent`. A non-empty array means
  // this department is not a leaf (can't take employees directly) and can't be deleted.
  children?: { id: string; name: string }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateDepartmentActionResult = DepartmentResult;

export type UpdateDepartmentActionResult = DepartmentResult;

export type GetDepartmentActionResult = DepartmentResult;

export type DepartmentOverview = {
  totalEmployees: number;
  childrenCount: number;
  positionCount: number;
  managerCount: number;
};

export type GetDepartmentDetailActionResult = DepartmentResult & {
  overview: DepartmentOverview;
};

export type GetAllDepartmentsActionResult = {
  departments: DepartmentResult[];
  pagination: PaginationMeta;
};

export type DeleteDepartmentActionResult = void;

export type GetDepartmentStatsActionResult = {
  totalDepartments: number;
  activeDepartments: number;
  inactiveDepartments: number;
  averageDepartmentSize: number;
};
