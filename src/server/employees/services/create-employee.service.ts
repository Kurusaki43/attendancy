import { randomBytes } from 'crypto';
import ms from 'ms';

import { env } from '@/lib/env/env';
import { ConflictError } from '@/lib/errors/conflict.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { InternalServerError } from '@/lib/errors/internal-server.error';
import { NotFoundError } from '@/lib/errors/not-found.error';
import { prisma } from '@/lib/prisma';
import { ROLE_NAMES } from '@/server/auth/constants/roles';
import { hashOtp } from '@/server/auth/lib/otp';
import { userRepository } from '@/server/auth/repositories/user.repository';
import { departmentRepository } from '@/server/departments/repositories/department.repository';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';
import type { CreateEmployeeInput } from '@/server/employees/schemas/create-employee.schema';
import type { CreateEmployeeServiceResult } from '@/server/employees/types';
import { emailQueueService } from '@/server/mail/services/email-queue.service';
import { positionRepository } from '@/server/positions/repositories/position.repository';
import { humanizeDuration } from '@/shared/utils/humanize-duration';

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
  }

  if (input.positionId) {
    const position = await positionRepository.findById(input.positionId);
    if (!position) {
      throw new NotFoundError(ERROR_CODES.POSITION_NOT_FOUND, 'Position not found!');
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

  const token = randomBytes(32).toString('hex');
  const codeHash = await hashOtp(token);

  const { user, employee, otp } = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        avatar: input.avatar || null,
        provider: 'LOCAL',
        status: 'INVITED',
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
        isActive: input.isActive,
        userId: user.id,
        departmentId: input.departmentId,
        positionId: input.positionId,
        managerId: input.managerId,
      },
    });

    const otp = await tx.otp.create({
      data: {
        userId: user.id,
        type: 'EMPLOYEE_INVITE',
        codeHash,
        expiresAt: new Date(Date.now() + ms(env.INVITATION_LINK_EXPIRED_IN)),
      },
    });

    return { user, employee, otp };
  });

  const inviteUrl = `${env.APP_URL}/accept-invite?id=${otp.id}&token=${token}`;

  await emailQueueService.sendEmployeeInviteEmail({
    to: user.email,
    firstName: user.firstName,
    inviteUrl,
    expiresIn: humanizeDuration(env.INVITATION_LINK_EXPIRED_IN),
  });

  const created = await employeeRepository.findById(employee.id);

  if (!created) {
    throw new InternalServerError(
      ERROR_CODES.EMPLOYEE_NOT_FOUND,
      'Employee was created but could not be reloaded.',
    );
  }

  return created;
}
