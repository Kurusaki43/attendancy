import type { Prisma } from '@/generated/prisma/client';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { positionRepository } from '@/server/positions/repositories/position.repository';
import type { PositionQueryInput } from '@/server/positions/schemas/get-all-positions-query-schema';
import { positionQuerySchema } from '@/server/positions/schemas/get-all-positions-query-schema';
import { ApiFeaturesBuilder } from '@/shared/builders/api-features.builder';
import type { PaginationMeta } from '@/shared/types/api-feature';

const POSITION_SEARCHABLE_FIELDS = ['title', 'code', 'description'];
const POSITION_FILTERABLE_FIELDS = ['isActive'];

export interface GetAllPositionsResult {
  positions: Prisma.PositionGetPayload<Record<string, never>>[];
  pagination: PaginationMeta;
}

function normalizeAndValidate(rawQuery: URLSearchParams | Record<string, string>): {
  validated: PositionQueryInput;
  asObject: Record<string, string>;
} {
  const asObject =
    rawQuery instanceof URLSearchParams ? Object.fromEntries(rawQuery.entries()) : rawQuery;

  const parsed = positionQuerySchema.safeParse(asObject);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new BadRequestError(ERROR_CODES.BAD_QUERY_PARAMS, message);
  }

  return { validated: parsed.data, asObject };
}

export async function getAllPositions(
  rawQuery: URLSearchParams | Record<string, string>,
): Promise<GetAllPositionsResult> {
  const { asObject } = normalizeAndValidate(rawQuery);

  const features = new ApiFeaturesBuilder<
    Prisma.PositionWhereInput,
    Prisma.PositionOrderByWithRelationInput,
    Prisma.PositionSelect
  >(asObject, POSITION_SEARCHABLE_FIELDS, POSITION_FILTERABLE_FIELDS)
    .filter()
    .search()
    .sort('createdAt')
    .limitFields()
    .paginate();

  const query = features.build();

  const [positions, totalCount] = await Promise.all([
    positionRepository.findMany(query),
    positionRepository.count(query.where),
  ]);

  return {
    positions,
    pagination: features.getPaginationMeta(totalCount),
  };
}
