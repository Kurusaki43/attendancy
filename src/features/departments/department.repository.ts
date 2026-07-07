import type { Prisma } from '@/generated/prisma/client';
import type { DepartmentCreateInput, DepartmentUpdateInput } from '@/generated/prisma/models';
import { prisma } from '@/lib/prisma';
import type { PrismaQueryOptions } from '@/shared/types/api-feature';

export type DepartmentFindManyQuery = PrismaQueryOptions<
  Prisma.DepartmentWhereInput,
  Prisma.DepartmentOrderByWithRelationInput,
  Prisma.DepartmentSelect
>;

export const departmentRepository = {
  create(data: DepartmentCreateInput) {
    return prisma.department.create({ data });
  },

  findById(departmentID: string) {
    return prisma.department.findUnique({ where: { id: departmentID } });
  },
  findByName(name: string) {
    return prisma.department.findUnique({ where: { name } });
  },
  update(departmentID: string, newDate: DepartmentUpdateInput) {
    return prisma.department.update({ where: { id: departmentID }, data: newDate });
  },

  delete(departmentID: string) {
    return prisma.department.delete({ where: { id: departmentID } });
  },

  async findMany(query: DepartmentFindManyQuery) {
    return prisma.department.findMany(query);
  },

  async count(where?: Prisma.DepartmentWhereInput) {
    return prisma.department.count({ where });
  },
};
