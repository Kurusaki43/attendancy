import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';
import type { GetEmployeeServiceResult } from '@/server/employees/types';

export async function getEmployee(employeeId: string): Promise<GetEmployeeServiceResult> {
  const employee = await employeeRepository.findById(employeeId);

  if (!employee) {
    throw new NotFoundError(ERROR_CODES.EMPLOYEE_NOT_FOUND, 'Employee not found!');
  }

  return employee;
}
