import type {
  PaginationMeta,
  ParsedQuery,
  PrismaOrderByInput,
  PrismaQueryOptions,
  PrismaSelectInput,
  PrismaWhereInput,
} from '../types/api-feature';
import {
  buildPaginationMeta,
  castValue,
  getScalar,
  OPERATOR_MAP,
  parseSearchParams,
  RESERVED_QUERY_FIELDS,
  toPositiveInt,
} from '../utils/api-features';

export class ApiFeaturesBuilder<
  TWhereInput extends PrismaWhereInput = PrismaWhereInput,
  TOrderByInput extends PrismaOrderByInput = PrismaOrderByInput,
  TSelect extends PrismaSelectInput = PrismaSelectInput,
> {
  private queryOptions: PrismaQueryOptions<TWhereInput, TOrderByInput, TSelect> = {};
  private parsedQuery: ParsedQuery;
  private searchableFields: string[];
  private filterableFields: string[];
  private page: number;
  private limit: number;

  /**
   * `filterableFields` is an explicit allowlist of columns `.filter()` is allowed to build a
   * `where` clause from. Defaults to empty (no ad-hoc filtering) rather than "everything" —
   * without it, any query-string key would pass straight through to Prisma's `where`, which is
   * fine for a handful of harmless Department columns but becomes a real exposure risk the moment
   * this builder is reused on a model with sensitive fields (e.g. User).
   */
  constructor(
    searchParams: URLSearchParams | Record<string, string>,
    searchableFields: string[] = [],
    filterableFields: string[] = [],
  ) {
    this.parsedQuery = parseSearchParams(searchParams);
    this.searchableFields = searchableFields;
    this.filterableFields = filterableFields;
    this.page = toPositiveInt(getScalar(this.parsedQuery, 'page'), 1);
    this.limit = toPositiveInt(getScalar(this.parsedQuery, 'limit'), 10);
  }

  filter(): this {
    const where: Record<string, unknown> = { ...this.queryOptions.where };

    for (const [key, value] of Object.entries(this.parsedQuery)) {
      if (RESERVED_QUERY_FIELDS.has(key)) continue;
      if (!this.filterableFields.includes(key)) continue;

      if (typeof value === 'string') {
        where[key] = castValue(value);
      } else {
        const conditions: Record<string, string | number | boolean> = {};
        for (const [op, opValue] of Object.entries(value)) {
          const prismaOp = OPERATOR_MAP[op];
          if (prismaOp) {
            conditions[prismaOp] = castValue(opValue);
          }
        }
        where[key] = conditions;
      }
    }

    this.queryOptions.where = where as TWhereInput;
    return this;
  }

  search(): this {
    const term = getScalar(this.parsedQuery, 'search');

    if (term && this.searchableFields.length > 0) {
      const orConditions = this.searchableFields.map((field) => ({
        [field]: { contains: term, mode: 'insensitive' as const },
      }));

      this.queryOptions.where = {
        ...(this.queryOptions.where as Record<string, unknown>),
        OR: orConditions,
      } as unknown as TWhereInput;
    }
    return this;
  }

  sort(defaultSortField: string = 'createdAt'): this {
    const sortParam = getScalar(this.parsedQuery, 'sort');

    if (sortParam) {
      this.queryOptions.orderBy = sortParam.split(',').map((field) => {
        const trimmed = field.trim();
        const desc = trimmed.startsWith('-');
        const key = desc ? trimmed.substring(1) : trimmed;
        return { [key]: desc ? 'desc' : 'asc' } as TOrderByInput;
      });
    } else {
      this.queryOptions.orderBy = [{ [defaultSortField]: 'desc' } as TOrderByInput];
    }
    return this;
  }

  limitFields(): this {
    const fieldsParam = getScalar(this.parsedQuery, 'fields');

    if (fieldsParam) {
      const select: Record<string, boolean> = {};
      fieldsParam.split(',').forEach((field) => {
        select[field.trim()] = true;
      });
      this.queryOptions.select = select as TSelect;
    }
    return this;
  }

  paginate(): this {
    this.queryOptions.skip = (this.page - 1) * this.limit;
    this.queryOptions.take = this.limit;
    return this;
  }

  build(): PrismaQueryOptions<TWhereInput, TOrderByInput, TSelect> {
    return this.queryOptions;
  }

  getPaginationMeta(totalCount: number): PaginationMeta {
    return buildPaginationMeta(this.page, this.limit, totalCount);
  }
}
