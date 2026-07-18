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

// zodResolver types against the schema's pre-coercion input shape (hireDate is `unknown` here,
// since it's `z.coerce.date()`), not the CreateEmployeeInput/UpdateEmployeeInput output types
// the server actions expect — so the form itself is typed against the raw input shape.
export type CreateEmployeeFormValues = z.input<typeof createEmployeeSchema>;
export type UpdateEmployeeFormValues = z.input<typeof updateEmployeeSchema>;
export type EmployeeFormValues = CreateEmployeeFormValues | UpdateEmployeeFormValues;
export type EmployeeFormOutput = CreateEmployeeInput | UpdateEmployeeInput;

export function toDateInputValue(value: unknown) {
  if (!(value instanceof Date) && typeof value !== 'string') return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}
