import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ConflictError } from '@/lib/errors/conflict.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { InternalServerError } from '@/lib/errors/internal-server.error';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { prisma } from '@/lib/prisma';
import { ROLE_NAMES } from '@/server/auth/constants/roles';
import { userRepository } from '@/server/auth/repositories/user.repository';
import { departmentRepository } from '@/server/departments/repositories/department.repository';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';
import type { CreateEmployeeInput } from '@/server/employees/schemas/create-employee.schema';
import { sendEmployeeInvite } from '@/server/employees/services/send-employee-invite.service';
import type { CreateEmployeeServiceResult } from '@/server/employees/types';
import { positionRepository } from '@/server/positions/repositories/position.repository';

export async function createEmployee(
  input: CreateEmployeeInput,
): Promise<CreateEmployeeServiceResult> {
  const existingUser = await userRepository.findByEmail(input.email);

  if (existingUser) {
    throw new ConflictError(ERROR_CODES.EMAIL_ALREADY_EXISTS, 'Email already exists');
  }

  const existingEmployeeCode = await employeeRepository.findByEmployeeCode(input.employeeCode);

  if (existingEmployeeCode) {
    throw new ConflictError(
      ERROR_CODES.EMPLOYEE_CODE_ALREADY_EXISTS,
      'Employee code already in use!',
    );
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
    const manager = await employeeRepository.findById(input.managerId);
    if (!manager) {
      throw new NotFoundError(ERROR_CODES.EMPLOYEE_NOT_FOUND, 'Manager not found!');
    }
  }

  const employeeRole = await prisma.role.findUnique({
    where: { name: ROLE_NAMES.EMPLOYEE },
  });

  if (!employeeRole) {
    throw new InternalServerError(
      ERROR_CODES.ROLE_NOT_FOUND,
      'EMPLOYEE role not found. Please run database seeds OR add role first',
    );
  }

  const { user, employee } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        avatar: input.avatar || null,
        provider: 'LOCAL',
        status: 'INVITED',
        locale: input.locale,
        timezone: input.timezone,
        roles: { connect: { id: employeeRole.id } },
      },
    });

    const employee = await tx.employee.create({
      data: {
        employeeCode: input.employeeCode,
        phone: input.phone,
        hireDate: input.hireDate,
        gender: input.gender,
        birthDate: input.birthDate,
        address: input.address,
        employmentStatus: input.employmentStatus,
        userId: user.id,
        departmentId: input.departmentId,
        positionId: input.positionId,
        managerId: input.managerId,
      },
    });

    return { user, employee };
  });

  await sendEmployeeInvite({ userId: user.id, firstName: user.firstName, email: user.email });

  const created = await employeeRepository.findById(employee.id);

  if (!created) {
    throw new InternalServerError(
      ERROR_CODES.EMPLOYEE_NOT_FOUND,
      'Employee was created but could not be reloaded.',
    );
  }

  return created;
}
