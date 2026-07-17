import type { Prisma } from '@/generated/prisma/client';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import type { DepartmentWithRelations } from '@/server/departments/repositories/department.repository';
import { departmentRepository } from '@/server/departments/repositories/department.repository';
import type { DepartmentQueryInput } from '@/server/departments/schemas/get-all-departments-query-schema';
import { departmentQuerySchema } from '@/server/departments/schemas/get-all-departments-query-schema';
import { ApiFeaturesBuilder } from '@/shared/builders/api-features.builder';
import type { PaginationMeta } from '@/shared/types/api-feature';

const DEPARTMENT_SEARCHABLE_FIELDS = ['name', 'code', 'description'];
const DEPARTMENT_FILTERABLE_FIELDS = ['isActive', 'parentId'];

export interface GetAllDepartmentsResult {
  departments: DepartmentWithRelations[];
  pagination: PaginationMeta;
}

function normalizeAndValidate(rawQuery: URLSearchParams | Record<string, string>): {
  validated: DepartmentQueryInput;
  asObject: Record<string, string>;
} {
  const asObject =
    rawQuery instanceof URLSearchParams ? Object.fromEntries(rawQuery.entries()) : rawQuery;

  const parsed = departmentQuerySchema.safeParse(asObject);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new BadRequestError(ERROR_CODES.BAD_QUERY_PARAMS, message);
  }

  return { validated: parsed.data, asObject };
}

export async function getAllDepartments(
  rawQuery: URLSearchParams | Record<string, string>,
): Promise<GetAllDepartmentsResult> {
  const { asObject } = normalizeAndValidate(rawQuery);

  const features = new ApiFeaturesBuilder<
    Prisma.DepartmentWhereInput,
    Prisma.DepartmentOrderByWithRelationInput,
    Prisma.DepartmentSelect
  >(asObject, DEPARTMENT_SEARCHABLE_FIELDS, DEPARTMENT_FILTERABLE_FIELDS)
    .filter()
    .search()
    .sort('createdAt')
    .limitFields()
    .paginate();

  const query = features.build();

  const [departments, totalCount] = await Promise.all([
    departmentRepository.findMany(query),
    departmentRepository.count(query.where),
  ]);

  return {
    departments,
    pagination: features.getPaginationMeta(totalCount),
  };
}
