import type { Department } from '@/generated/prisma/client';

export type CreateDepartmentServiceResult = Department;

export type UpdateDepartmentServiceResult = Department;

export type GetDepartmentServiceResult = Department;

export type DeleteDepartmentServiceResult = void;

export type GetDepartmentStatsServiceResult = {
  totalDepartments: number;
  activeDepartments: number;
  inactiveDepartments: number;
  averageDepartmentSize: number;
};
