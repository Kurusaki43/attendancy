import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/employee.repository', () => ({
  employeeRepository: {
    findByEmployeeCode: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock('@/server/auth/repositories/user.repository', () => ({
  userRepository: {
    findByEmail: vi.fn(),
  },
}));

vi.mock('@/server/departments/repositories/department.repository', () => ({
  departmentRepository: {
    findById: vi.fn(),
    count: vi.fn(),
  },
}));

vi.mock('@/server/positions/repositories/position.repository', () => ({
  positionRepository: {
    findById: vi.fn(),
  },
}));

vi.mock('../../services/send-employee-invite.service', () => ({
  sendEmployeeInvite: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    role: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}));

const { employeeRepository } = await import('../../repositories/employee.repository');
const { userRepository } = await import('@/server/auth/repositories/user.repository');
const { departmentRepository } =
  await import('@/server/departments/repositories/department.repository');
const { positionRepository } = await import('@/server/positions/repositories/position.repository');
const { sendEmployeeInvite } = await import('../../services/send-employee-invite.service');
const { prisma } = await import('@/lib/prisma');
const { BadRequestError } = await import('@/lib/errors/bad-request.error');
const { ConflictError } = await import('@/lib/errors/conflict.error');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { InternalServerError } = await import('@/lib/errors/internal-server.error');
const { createEmployee } = await import('../../services/create-employee.service');

const input = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  employeeCode: 'EMP-001',
  hireDate: new Date('2026-01-01'),
  employmentStatus: 'ACTIVE',
} as Parameters<typeof createEmployee>[0];

const fakeTx = {
  user: { create: vi.fn() },
  employee: { create: vi.fn() },
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
  vi.mocked(employeeRepository.findByEmployeeCode).mockResolvedValue(null);
  vi.mocked(prisma.role.findUnique).mockResolvedValue({ id: 'role-employee' } as never);

  fakeTx.user.create.mockResolvedValue({ id: 'user-1', email: input.email, firstName: 'Ada' });
  fakeTx.employee.create.mockResolvedValue({ id: 'employee-1' });

  vi.mocked(prisma.$transaction).mockImplementation(((callback: (tx: typeof fakeTx) => unknown) =>
    callback(fakeTx)) as never);

  vi.mocked(employeeRepository.findById).mockResolvedValue({ id: 'employee-1' } as never);
});

describe('createEmployee', () => {
  it('creates the user and employee, then sends the invite', async () => {
    const result = await createEmployee(input);

    expect(fakeTx.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: input.email, provider: 'LOCAL' }),
      }),
    );
    expect(fakeTx.employee.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ employeeCode: input.employeeCode, userId: 'user-1' }),
      }),
    );
    expect(sendEmployeeInvite).toHaveBeenCalledWith({
      userId: 'user-1',
      firstName: 'Ada',
      email: input.email,
    });
    expect(result).toEqual({ id: 'employee-1' });
  });

  it('throws ConflictError when the email is already registered', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue({ id: 'existing-user' } as never);

    const result = createEmployee(input);

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMAIL_ALREADY_EXISTS });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws ConflictError when the employee code is already taken', async () => {
    vi.mocked(employeeRepository.findByEmployeeCode).mockResolvedValue({ id: 'existing' } as never);

    const result = createEmployee(input);

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_CODE_ALREADY_EXISTS });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws NotFoundError when the department does not exist', async () => {
    vi.mocked(departmentRepository.findById).mockResolvedValue(null);

    const result = createEmployee({ ...input, departmentId: 'missing-dept' });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_NOT_FOUND });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the department is inactive', async () => {
    vi.mocked(departmentRepository.findById).mockResolvedValue({
      id: 'dept-1',
      isActive: false,
    } as never);

    const result = createEmployee({ ...input, departmentId: 'dept-1' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_NOT_ACTIVE });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the department has sub-departments', async () => {
    vi.mocked(departmentRepository.findById).mockResolvedValue({
      id: 'dept-1',
      isActive: true,
    } as never);
    vi.mocked(departmentRepository.count).mockResolvedValue(1);

    const result = createEmployee({ ...input, departmentId: 'dept-1' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_NOT_LEAF });
    expect(departmentRepository.count).toHaveBeenCalledWith({ parentId: 'dept-1' });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('creates the employee when the department is active and a leaf', async () => {
    vi.mocked(departmentRepository.findById).mockResolvedValue({
      id: 'dept-1',
      isActive: true,
    } as never);
    vi.mocked(departmentRepository.count).mockResolvedValue(0);

    await createEmployee({ ...input, departmentId: 'dept-1' });

    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it('throws NotFoundError when the position does not exist', async () => {
    vi.mocked(positionRepository.findById).mockResolvedValue(null);

    const result = createEmployee({ ...input, positionId: 'missing-position' });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.POSITION_NOT_FOUND });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the position is inactive', async () => {
    vi.mocked(positionRepository.findById).mockResolvedValue({
      id: 'position-1',
      isActive: false,
    } as never);

    const result = createEmployee({ ...input, positionId: 'position-1' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.POSITION_NOT_ACTIVE });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('creates the employee when the position is active', async () => {
    vi.mocked(positionRepository.findById).mockResolvedValue({
      id: 'position-1',
      isActive: true,
    } as never);

    await createEmployee({ ...input, positionId: 'position-1' });

    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it('throws NotFoundError when the manager does not exist', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue(null);

    const result = createEmployee({ ...input, managerId: 'missing-manager' });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_NOT_FOUND });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('throws InternalServerError when the EMPLOYEE role is missing', async () => {
    vi.mocked(prisma.role.findUnique).mockResolvedValue(null);

    const result = createEmployee(input);

    await expect(result).rejects.toBeInstanceOf(InternalServerError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.ROLE_NOT_FOUND });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
