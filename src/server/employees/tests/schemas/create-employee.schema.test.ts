import { describe, expect, it } from 'vitest';

import { createEmployeeSchema } from '@/server/employees/schemas/create-employee.schema';

const baseInput = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  employeeCode: 'EMP-001',
};

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

describe('createEmployeeSchema', () => {
  it('accepts a hire date in the past', () => {
    const result = createEmployeeSchema.safeParse({
      ...baseInput,
      hireDate: addDays(new Date(), -1),
    });

    expect(result.success).toBe(true);
  });

  it('accepts a hire date of today', () => {
    const result = createEmployeeSchema.safeParse({ ...baseInput, hireDate: new Date() });

    expect(result.success).toBe(true);
  });

  it('rejects a hire date in the future', () => {
    const result = createEmployeeSchema.safeParse({
      ...baseInput,
      hireDate: addDays(new Date(), 1),
    });

    expect(result.success).toBe(false);
  });

  it('accepts a birth date in the past', () => {
    const result = createEmployeeSchema.safeParse({
      ...baseInput,
      birthDate: addDays(new Date(), -1),
    });

    expect(result.success).toBe(true);
  });

  it('accepts a request without a birth date', () => {
    const result = createEmployeeSchema.safeParse(baseInput);

    expect(result.success).toBe(true);
  });

  it('rejects a birth date in the future', () => {
    const result = createEmployeeSchema.safeParse({
      ...baseInput,
      birthDate: addDays(new Date(), 1),
    });

    expect(result.success).toBe(false);
  });
});
