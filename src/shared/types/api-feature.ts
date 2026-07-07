export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationMeta;
}

/** A parsed query value: either a plain scalar or an operator map (e.g. { gte: '10' }) */
export type QueryValue = string | Record<string, string>;

/** The fully parsed, nested representation of incoming query params */
export type ParsedQuery = Record<string, QueryValue>;

/** The final Prisma-compatible query object produced by `.build()` */
export interface PrismaQueryOptions<TWhereInput, TOrderByInput, TSelect> {
  where?: TWhereInput;
  orderBy?: TOrderByInput[];
  select?: TSelect;
  skip?: number;
  take?: number;
}

/** Generic constraints shared by all three Prisma-generated type params */
export type PrismaWhereInput = Record<string, unknown>;
export type PrismaOrderByInput = Record<string, unknown>;
export type PrismaSelectInput = Record<string, unknown>;
