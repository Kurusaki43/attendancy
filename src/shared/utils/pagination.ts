import type { PaginationMeta } from '@/shared/types/api-feature';

export class PaginationUtil {
  static readonly DEFAULT_PAGE = 1;
  static readonly DEFAULT_LIMIT = 10;
  static readonly MAX_LIMIT = 100;

  static getPage(page?: number) {
    if (!page || page < 1) {
      return this.DEFAULT_PAGE;
    }

    return page;
  }

  static getLimit(limit?: number) {
    if (!limit || limit < 1) {
      return this.DEFAULT_LIMIT;
    }

    return Math.min(limit, this.MAX_LIMIT);
  }

  static getSkip(page: number, limit: number) {
    return (page - 1) * limit;
  }

  static createMeta(totalItems: number, page: number, limit: number): PaginationMeta {
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    return {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}
