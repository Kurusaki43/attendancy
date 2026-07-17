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
  },
}));

vi.mock('@/server/positions/repositories/position.repository', () => ({
  positionRepository: {
    findById: vi.fn(),
  },
}));

const { employeeRepository } = await import('../../repositories/employee.repository');
const { departmentRepository } = await import('@/server/departments/repositories/department.repository');
const { positionRepository } = await import('@/server/positions/repositories/position.repository');
const { BadRequestError } = await import('@/lib/errors/bad-request.error');
const { ConflictError } = await import('@/lib/errors/conflict.error');
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

  it('throws NotFoundError when the position does not exist', async () => {
    vi.mocked(positionRepository.findById).mockResolvedValue(null);

    const result = updateEmployee('employee-1', { positionId: 'missing-position' });

    await expect(result).rejects.toBeInstanceOf(NotFoundError);
    await expect(result).rejects.toMatchObject({ code: ERROR_CODES.POSITION_NOT_FOUND });
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
});
