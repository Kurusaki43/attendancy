import type { z } from 'zod';

import type {
  CreateEmployeeInput,
  createEmployeeSchema,
} from '@/server/employees/schemas/create-employee.schema';
import type {
  UpdateEmployeeInput,
  updateEmployeeSchema,
} from '@/server/employees/schemas/update-employee.schema';

export const NONE = 'none';

export type SelectOption = { id: string; label: string };

export type CreateEmployeeFormValues = z.input<typeof createEmployeeSchema>;
export type UpdateEmployeeFormValues = z.input<typeof updateEmployeeSchema>;

export type EmployeeFormValues = CreateEmployeeFormValues | UpdateEmployeeFormValues;
export type EmployeeFormOutput = CreateEmployeeInput | UpdateEmployeeInput;

export function toDateValue(value: unknown): Date | undefined {
  if (!(value instanceof Date) && typeof value !== 'string') return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}
