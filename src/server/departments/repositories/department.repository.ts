import type { Prisma } from '@/generated/prisma/client';
import type {
  DepartmentUncheckedCreateInput,
  DepartmentUncheckedUpdateInput,
} from '@/generated/prisma/models';
import { prisma } from '@/lib/prisma';
import type { PrismaQueryOptions } from '@/shared/types/api-feature';

export type DepartmentFindManyQuery = PrismaQueryOptions<
  Prisma.DepartmentWhereInput,
  Prisma.DepartmentOrderByWithRelationInput,
  Prisma.DepartmentSelect
>;

const DEPARTMENT_PARENT_SELECT = {
  id: true,
  name: true,
  code: true,
  icon: true,
  color: true,
} satisfies Prisma.DepartmentSelect;

const DEPARTMENT_CHILD_SELECT = {
  id: true,
  name: true,
} satisfies Prisma.DepartmentSelect;

export type DepartmentWithRelations = Prisma.DepartmentGetPayload<{
  include: {
    parent: { select: typeof DEPARTMENT_PARENT_SELECT };
    children: { select: typeof DEPARTMENT_CHILD_SELECT };
    _count: { select: { employees: true } };
  };
}>;

export const departmentRepository = {
  create(data: DepartmentUncheckedCreateInput) {
    return prisma.department.create({ data });
  },

  findById(departmentID: string) {
    return prisma.department.findUnique({ where: { id: departmentID } });
  },
  findByName(name: string) {
    return prisma.department.findUnique({ where: { name } });
  },
  findByCode(code: string) {
    return prisma.department.findUnique({ where: { code } });
  },
  update(departmentID: string, newDate: DepartmentUncheckedUpdateInput) {
    return prisma.department.update({ where: { id: departmentID }, data: newDate });
  },

  delete(departmentID: string) {
    return prisma.department.delete({ where: { id: departmentID } });
  },

  findMany(query: DepartmentFindManyQuery) {
    return prisma.department.findMany({
      ...query,
      include: {
        parent: { select: DEPARTMENT_PARENT_SELECT },
        children: { select: DEPARTMENT_CHILD_SELECT },
        _count: { select: { employees: true } },
      },
    });
  },

  count(where?: Prisma.DepartmentWhereInput) {
    return prisma.department.count({ where });
  },
};
