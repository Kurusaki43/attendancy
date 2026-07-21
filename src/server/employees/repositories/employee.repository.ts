import type { Prisma } from '@/generated/prisma/client';
import { EmploymentStatus } from '@/generated/prisma/enums';
import type {
  EmployeeUncheckedCreateInput,
  EmployeeUncheckedUpdateInput,
} from '@/generated/prisma/models';
import { prisma } from '@/lib/prisma';
import type { PrismaQueryOptions } from '@/shared/types/api-feature';

export const EMPLOYEE_INCLUDE = {
  user: {
    select: { id: true, firstName: true, lastName: true, email: true, status: true, avatar: true },
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

  // Cursor-based (not skip/take): offset pagination can silently skip rows if the active-employee
  // set changes mid-scan (e.g. someone is hired between pages), since inserts/updates shift row
  // positions in the ordering out from under a numeric offset. `id > cursor` never depends on how
  // many rows exist before the cursor, so it can't be shifted by concurrent writes.
  async findActiveEmployeeIds({ cursor, take }: { cursor?: string; take: number }) {
    const rows = await prisma.employee.findMany({
      where: {
        employmentStatus: EmploymentStatus.ACTIVE,
        ...(cursor && { id: { gt: cursor } }),
      },
      select: { id: true },
      orderBy: { id: 'asc' },
      take,
    });
    return rows.map((row) => row.id);
  },
};
