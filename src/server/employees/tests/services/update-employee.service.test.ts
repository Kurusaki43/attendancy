import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ERROR_CODES } from '@/lib/errors/error-codes';

vi.mock('../../repositories/employee.repository', () => ({
  employeeRepository: {
    findById: vi.fn(),
    findByEmployeeCode: vi.fn(),
    update: vi.fn(),
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

vi.mock('@/server/auth/repositories/user.repository', () => ({
  userRepository: {
    update: vi.fn(),
    findByEmail: vi.fn(),
  },
}));

const { employeeRepository } = await import('../../repositories/employee.repository');
const { departmentRepository } =
  await import('@/server/departments/repositories/department.repository');
const { positionRepository } = await import('@/server/positions/repositories/position.repository');
const { userRepository } = await import('@/server/auth/repositories/user.repository');
const { BadRequestError } = await import('@/lib/errors/bad-request.error');
const { ConflictError } = await import('@/lib/errors/conflict.error');
const { ForbiddenError } = await import('@/lib/errors/forbidden.error');
const { NotFoundError } = await import('@/lib/errors/not-found.error');
const { updateEmployee } = await import('../../services/update-employee.service');

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(employeeRepository.findById).mockResolvedValue({ id: 'employee-1' } as never);
});

describe('updateEmployee', () => {
  it('throws NotFoundError when the employee does not exist', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue(null);

    const result = updateEmployee('missing-id', { phone: '555-0100' });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_NOT_FOUND });
  });

  it('updates the employee when no code/department/position/manager is provided', async () => {
    vi.mocked(employeeRepository.update).mockResolvedValue({
      id: 'employee-1',
      phone: '555-0100',
    } as never);

    const result = await updateEmployee('employee-1', { phone: '555-0100' });

    expect(employeeRepository.findByEmployeeCode).not.toHaveBeenCalled();
    expect(employeeRepository.update).toHaveBeenCalledWith('employee-1', { phone: '555-0100' });
    expect(result).toEqual({ id: 'employee-1', phone: '555-0100' });
  });

  it('throws ConflictError when the employee code belongs to a different employee', async () => {
    vi.mocked(employeeRepository.findByEmployeeCode).mockResolvedValue({
      id: 'employee-2',
    } as never);

    const result = updateEmployee('employee-1', { employeeCode: 'EMP-002' });

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_CODE_ALREADY_EXISTS });
    expect(employeeRepository.update).not.toHaveBeenCalled();
  });

  it('throws NotFoundError when the department does not exist', async () => {
    vi.mocked(departmentRepository.findById).mockResolvedValue(null);

    const result = updateEmployee('employee-1', { departmentId: 'missing-dept' });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_NOT_FOUND });
    expect(employeeRepository.update).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the department is inactive', async () => {
    vi.mocked(departmentRepository.findById).mockResolvedValue({
      id: 'dept-1',
      isActive: false,
    } as never);

    const result = updateEmployee('employee-1', { departmentId: 'dept-1' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_NOT_ACTIVE });
    expect(employeeRepository.update).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the department has sub-departments', async () => {
    vi.mocked(departmentRepository.findById).mockResolvedValue({
      id: 'dept-1',
      isActive: true,
    } as never);
    vi.mocked(departmentRepository.count).mockResolvedValue(3);

    const result = updateEmployee('employee-1', { departmentId: 'dept-1' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.DEPARTMENT_NOT_LEAF });
    expect(departmentRepository.count).toHaveBeenCalledWith({ parentId: 'dept-1' });
    expect(employeeRepository.update).not.toHaveBeenCalled();
  });

  it('throws NotFoundError when the position does not exist', async () => {
    vi.mocked(positionRepository.findById).mockResolvedValue(null);

    const result = updateEmployee('employee-1', { positionId: 'missing-position' });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.POSITION_NOT_FOUND });
    expect(employeeRepository.update).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the position is inactive', async () => {
    vi.mocked(positionRepository.findById).mockResolvedValue({
      id: 'position-1',
      isActive: false,
    } as never);

    const result = updateEmployee('employee-1', { positionId: 'position-1' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.POSITION_NOT_ACTIVE });
    expect(employeeRepository.update).not.toHaveBeenCalled();
  });

  it('throws BadRequestError when the manager is the employee itself', async () => {
    const result = updateEmployee('employee-1', { managerId: 'employee-1' });

    await expect(result).rejects.toBeInstanceOf(BadRequestError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_INVALID_MANAGER });
    expect(employeeRepository.update).not.toHaveBeenCalled();
  });

  it('throws NotFoundError when the manager does not exist', async () => {
    vi.mocked(employeeRepository.findById).mockImplementation(((id: string) =>
      Promise.resolve(id === 'employee-1' ? { id: 'employee-1' } : null)) as never);

    const result = updateEmployee('employee-1', { managerId: 'missing-manager' });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_NOT_FOUND });
    expect(employeeRepository.update).not.toHaveBeenCalled();
  });

  it('throws ForbiddenError when changing name/email on a non-invited employee', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue({
      id: 'employee-1',
      userId: 'user-1',
      user: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', status: 'ACTIVE' },
    } as never);

    const result = updateEmployee('employee-1', { firstName: 'Grace' });

    await expect(result).rejects.toBeInstanceOf(ForbiddenError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMPLOYEE_IDENTITY_LOCKED });
    expect(employeeRepository.update).not.toHaveBeenCalled();
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('allows changing name/email while the employee is still invited', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue({
      id: 'employee-1',
      userId: 'user-1',
      user: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', status: 'INVITED' },
    } as never);
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(employeeRepository.update).mockResolvedValue({ id: 'employee-1' } as never);

    await updateEmployee('employee-1', { firstName: 'Grace', email: 'grace@example.com' });

    expect(userRepository.update).toHaveBeenCalledWith({
      userId: 'user-1',
      newData: { firstName: 'Grace', email: 'grace@example.com' },
    });
    expect(employeeRepository.update).toHaveBeenCalledWith('employee-1', {});
  });

  it('throws ConflictError when the new email belongs to a different user', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue({
      id: 'employee-1',
      userId: 'user-1',
      user: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', status: 'INVITED' },
    } as never);
    vi.mocked(userRepository.findByEmail).mockResolvedValue({ id: 'user-2' } as never);

    const result = updateEmployee('employee-1', { email: 'taken@example.com' });

    await expect(result).rejects.toBeInstanceOf(ConflictError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.EMAIL_ALREADY_EXISTS });
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('does not treat an unchanged name/email as a locked-identity edit', async () => {
    vi.mocked(employeeRepository.findById).mockResolvedValue({
      id: 'employee-1',
      userId: 'user-1',
      user: { firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', status: 'ACTIVE' },
    } as never);
    vi.mocked(employeeRepository.update).mockResolvedValue({ id: 'employee-1' } as never);

    await updateEmployee('employee-1', { firstName: 'Ada', phone: '555-0100' });

    expect(userRepository.update).not.toHaveBeenCalled();
    expect(employeeRepository.update).toHaveBeenCalledWith('employee-1', { phone: '555-0100' });
  });
});
