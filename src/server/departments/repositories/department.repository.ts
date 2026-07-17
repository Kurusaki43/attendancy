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
    return prisma.department.findMany(query);
  },

  count(where?: Prisma.DepartmentWhereInput) {
    return prisma.department.count({ where });
  },
};
