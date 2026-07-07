import type { PaginationMeta, ParsedQuery } from '../types/api-feature';

/** Query params that are reserved for query mechanics, not entity filters */
export const RESERVED_QUERY_FIELDS = new Set(['page', 'sort', 'limit', 'fields', 'search']);

/** Maps REST-style bracket operators to their Prisma equivalents */
export const OPERATOR_MAP: Record<string, string> = {
  gte: 'gte',
  gt: 'gt',
  lte: 'lte',
  lt: 'lt',
  ne: 'not',
  eq: 'equals',
  in: 'in',
};

/**
 * Converts URLSearchParams (or a plain object) into a nested structure, so
 * `?price[gte]=10&price[lte]=100` becomes `{ price: { gte: '10', lte: '100' } }`.
 */
export function parseSearchParams(input: URLSearchParams | Record<string, string>): ParsedQuery {
  const entries: [string, string][] =
    input instanceof URLSearchParams ? Array.from(input.entries()) : Object.entries(input);

  const result: ParsedQuery = {};

  for (const [rawKey, value] of entries) {
    const match = rawKey.match(/^([^[]+)\[([^\]]+)]$/); // e.g. price[gte]

    if (match) {
      const [, field, operator] = match;
      const existing = result[field];
      const nested = existing && typeof existing === 'object' ? existing : {};
      result[field] = { ...nested, [operator]: value };
    } else {
      result[rawKey] = value;
    }
  }

  return result;
}

/** Reads a single scalar value out of a ParsedQuery, ignoring operator maps */
export function getScalar(parsedQuery: ParsedQuery, key: string): string | undefined {
  const value = parsedQuery[key];
  return typeof value === 'string' ? value : undefined;
}

/** Parses a string into a positive integer, falling back if invalid */
export function toPositiveInt(value: string | undefined, fallback: number): number {
  const parsed = value !== undefined ? parseInt(value, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** Converts a raw query string value into a proper JS type */
export function castValue(value: string): string | number | boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value !== '' && !Number.isNaN(Number(value))) return Number(value);
  return value;
}

/** Builds pagination metadata for an API response */
export function buildPaginationMeta(
  page: number,
  limit: number,
  totalCount: number,
): PaginationMeta {
  const totalPages = Math.ceil(totalCount / limit);
  return {
    page,
    limit,
    totalItems: totalCount,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
