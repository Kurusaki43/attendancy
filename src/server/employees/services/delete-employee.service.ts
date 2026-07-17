import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { userRepository } from '@/server/auth/repositories/user.repository';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';
import type { DeleteEmployeeServiceResult } from '@/server/employees/types';

export async function deleteEmployee(employeeId: string): Promise<DeleteEmployeeServiceResult> {
  const employee = await employeeRepository.findById(employeeId);

  if (!employee) {
    throw new NotFoundError(ERROR_CODES.EMPLOYEE_NOT_FOUND, 'Employee not found!');
  }

  // Deleting the user cascades to the employee row (and their sessions/OTPs); subordinates'
  // managerId is set null by the schema's onDelete: SetNull.
  await userRepository.delete(employee.userId);
}
