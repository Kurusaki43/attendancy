import type { DepartmentCreateInput, DepartmentUpdateInput } from '@/generated/prisma/models';
import { prisma } from '@/lib/prisma';

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
  getAll() {
    return prisma.department.findMany({ orderBy: { name: 'asc' } });
  },
  update(departmentID: string, newDate: DepartmentUpdateInput) {
    return prisma.department.update({ where: { id: departmentID }, data: newDate });
  },

  delete(departmentID: string) {
    return prisma.department.delete({ where: { id: departmentID } });
  },
};
