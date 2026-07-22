import { describe, expect, it } from 'vitest';

import { updateEmployeeSchema } from '@/server/employees/schemas/update-employee.schema';

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

describe('updateEmployeeSchema', () => {
  it('accepts a request with no hire/birth date at all', () => {
    const result = updateEmployeeSchema.safeParse({ phone: '555-0100' });

    expect(result.success).toBe(true);
  });

  it('accepts a hire date of today or in the past', () => {
    expect(updateEmployeeSchema.safeParse({ hireDate: new Date() }).success).toBe(true);
    expect(updateEmployeeSchema.safeParse({ hireDate: addDays(new Date(), -1) }).success).toBe(
      true,
    );
  });

  it('rejects a hire date in the future', () => {
    const result = updateEmployeeSchema.safeParse({ hireDate: addDays(new Date(), 1) });

    expect(result.success).toBe(false);
  });

  it('accepts a null birth date (clearing it)', () => {
    const result = updateEmployeeSchema.safeParse({ birthDate: null });

    expect(result.success).toBe(true);
  });

  it('accepts a birth date in the past', () => {
    const result = updateEmployeeSchema.safeParse({ birthDate: addDays(new Date(), -1) });

    expect(result.success).toBe(true);
  });

  it('rejects a birth date in the future', () => {
    const result = updateEmployeeSchema.safeParse({ birthDate: addDays(new Date(), 1) });

    expect(result.success).toBe(false);
  });
});
