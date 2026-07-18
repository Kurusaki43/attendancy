import type { Prisma } from '@/generated/prisma/client';
import type { PositionCreateInput, PositionUpdateInput } from '@/generated/prisma/models';
import { prisma } from '@/lib/prisma';
import type { PrismaQueryOptions } from '@/shared/types/api-feature';

export type PositionFindManyQuery = PrismaQueryOptions<
  Prisma.PositionWhereInput,
  Prisma.PositionOrderByWithRelationInput,
  Prisma.PositionSelect
>;

export const positionRepository = {
  create(data: PositionCreateInput) {
    return prisma.position.create({ data });
  },

  findById(positionID: string) {
    return prisma.position.findUnique({ where: { id: positionID } });
  },
  findByTitle(title: string) {
    return prisma.position.findUnique({ where: { title } });
  },
  findByCode(code: string) {
    return prisma.position.findUnique({ where: { code } });
  },
  update(positionID: string, newDate: PositionUpdateInput) {
    return prisma.position.update({ where: { id: positionID }, data: newDate });
  },

  delete(positionID: string) {
    return prisma.position.delete({ where: { id: positionID } });
  },

  findMany(query: PositionFindManyQuery) {
    return prisma.position.findMany(query);
  },

  count(where?: Prisma.PositionWhereInput) {
    return prisma.position.count({ where });
  },
};
