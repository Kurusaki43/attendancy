import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';
import { sendEmployeeInvite } from '@/server/employees/services/send-employee-invite.service';

export async function resendEmployeeInvite(employeeId: string): Promise<void> {
  const employee = await employeeRepository.findById(employeeId);

  if (!employee) {
    throw new NotFoundError(ERROR_CODES.EMPLOYEE_NOT_FOUND, 'Employee not found!');
  }

  if (employee.user.status !== 'INVITED') {
    throw new BadRequestError(
      ERROR_CODES.EMPLOYEE_NOT_INVITED,
      'This employee has already accepted their invitation.',
    );
  }

  await sendEmployeeInvite({
    userId: employee.userId,
    firstName: employee.user.firstName,
    email: employee.user.email,
  });
}
