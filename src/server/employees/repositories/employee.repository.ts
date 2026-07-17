import type { Prisma } from '@/generated/prisma/client';
import type {
  EmployeeUncheckedCreateInput,
  EmployeeUncheckedUpdateInput,
} from '@/generated/prisma/models';
import { prisma } from '@/lib/prisma';
import type { PrismaQueryOptions } from '@/shared/types/api-feature';

export const EMPLOYEE_INCLUDE = {
  user: {
    select: { id: true, firstName: true, lastName: true, email: true, status: true },
  },
  department: true,
  position: true,
  manager: {
    include: {
      user: { select: { firstName: true, lastName: true } },
    },
  },
} satisfies Prisma.EmployeeInclude;

export type EmployeeFindManyQuery = PrismaQueryOptions<
  Prisma.EmployeeWhereInput,
  Prisma.EmployeeOrderByWithRelationInput,
  Prisma.EmployeeSelect
>;

export const employeeRepository = {
  create(data: EmployeeUncheckedCreateInput) {
    return prisma.employee.create({ data, include: EMPLOYEE_INCLUDE });
  },

  findById(employeeId: string) {
    return prisma.employee.findUnique({ where: { id: employeeId }, include: EMPLOYEE_INCLUDE });
  },

  findByEmployeeCode(employeeCode: string) {
    return prisma.employee.findUnique({ where: { employeeCode } });
  },

  findByUserId(userId: string) {
    return prisma.employee.findUnique({ where: { userId } });
  },

  update(employeeId: string, newData: EmployeeUncheckedUpdateInput) {
    return prisma.employee.update({
      where: { id: employeeId },
      data: newData,
      include: EMPLOYEE_INCLUDE,
    });
  },

  delete(employeeId: string) {
    return prisma.employee.delete({ where: { id: employeeId } });
  },

  findMany(query: EmployeeFindManyQuery) {
    return prisma.employee.findMany({ ...query, include: EMPLOYEE_INCLUDE });
  },

  count(where?: Prisma.EmployeeWhereInput) {
    return prisma.employee.count({ where });
  },
};
