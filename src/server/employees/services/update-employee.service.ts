import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ConflictError } from '@/lib/errors/conflict.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { ForbiddenError } from '@/lib/errors/forbidden.error';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { userRepository } from '@/server/auth/repositories/user.repository';
import { departmentRepository } from '@/server/departments/repositories/department.repository';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';
import type { UpdateEmployeeInput } from '@/server/employees/schemas/update-employee.schema';
import type { UpdateEmployeeServiceResult } from '@/server/employees/types';
import { positionRepository } from '@/server/positions/repositories/position.repository';

export async function updateEmployee(
  employeeId: string,
  input: UpdateEmployeeInput,
): Promise<UpdateEmployeeServiceResult> {
  const employee = await employeeRepository.findById(employeeId);

  if (!employee) {
    throw new NotFoundError(ERROR_CODES.EMPLOYEE_NOT_FOUND, 'Employee not found!');
  }

  if (typeof input.employeeCode === 'string') {
    const employeeWithCode = await employeeRepository.findByEmployeeCode(input.employeeCode);

    if (employeeWithCode && employeeWithCode.id !== employeeId) {
      throw new ConflictError(
        ERROR_CODES.EMPLOYEE_CODE_ALREADY_EXISTS,
        'Employee code already in use!',
      );
    }
  }

  if (input.departmentId) {
    const department = await departmentRepository.findById(input.departmentId);
    if (!department) {
      throw new NotFoundError(ERROR_CODES.DEPARTMENT_NOT_FOUND, 'Department not found!');
    }

    if (!department.isActive) {
      throw new BadRequestError(
        ERROR_CODES.DEPARTMENT_NOT_ACTIVE,
        'This department is inactive and cannot be assigned.',
      );
    }

    const childrenCount = await departmentRepository.count({ parentId: input.departmentId });

    if (childrenCount > 0) {
      throw new BadRequestError(
        ERROR_CODES.DEPARTMENT_NOT_LEAF,
        'Employees can only be assigned to departments that have no sub-departments.',
      );
    }
  }

  if (input.positionId) {
    const position = await positionRepository.findById(input.positionId);
    if (!position) {
      throw new NotFoundError(ERROR_CODES.POSITION_NOT_FOUND, 'Position not found!');
    }

    if (!position.isActive) {
      throw new BadRequestError(
        ERROR_CODES.POSITION_NOT_ACTIVE,
        'This position is inactive and cannot be assigned.',
      );
    }
  }

  if (input.managerId) {
    if (input.managerId === employeeId) {
      throw new BadRequestError(
        ERROR_CODES.EMPLOYEE_INVALID_MANAGER,
        'An employee cannot be their own manager.',
      );
    }

    const manager = await employeeRepository.findById(input.managerId);
    if (!manager) {
      throw new NotFoundError(ERROR_CODES.EMPLOYEE_NOT_FOUND, 'Manager not found!');
    }
  }

  const { avatar, firstName, lastName, email, ...employeeData } = input;

  const identityFieldsRequested =
    (firstName !== undefined && firstName !== employee.user.firstName) ||
    (lastName !== undefined && lastName !== employee.user.lastName) ||
    (email !== undefined && email !== employee.user.email);

  if (identityFieldsRequested && employee.user.status !== 'INVITED') {
    throw new ForbiddenError(
      ERROR_CODES.EMPLOYEE_IDENTITY_LOCKED,
      'Name and email can only be changed while the employee invitation is still pending.',
    );
  }

  if (email && email !== employee.user.email) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser && existingUser.id !== employee.userId) {
      throw new ConflictError(ERROR_CODES.EMAIL_ALREADY_EXISTS, 'Email already exists');
    }
  }

  if (avatar !== undefined || identityFieldsRequested) {
    await userRepository.update({
      userId: employee.userId,
      newData: {
        ...(avatar !== undefined && { avatar: avatar === '' ? null : avatar }),
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(email !== undefined && { email }),
      },
    });
  }

  return await employeeRepository.update(employeeId, employeeData);
}
