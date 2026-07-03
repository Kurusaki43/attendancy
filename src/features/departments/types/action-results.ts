export type DepartmentResult = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateDepartmentActionResult = DepartmentResult;

export type UpdateDepartmentActionResult = DepartmentResult;

export type GetDepartmentActionResult = DepartmentResult;

export type GetAllDepartmentsActionResult = DepartmentResult[];

export type DeleteDepartmentActionResult = void;
