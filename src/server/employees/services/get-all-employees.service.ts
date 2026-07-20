import type { Prisma } from '@/generated/prisma/client';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';
import type { EmployeeQueryInput } from '@/server/employees/schemas/get-all-employees-query-schema';
import { employeeQuerySchema } from '@/server/employees/schemas/get-all-employees-query-schema';
import type { EmployeeWithRelations } from '@/server/employees/types';
import { ApiFeaturesBuilder } from '@/shared/builders/api-features.builder';
import type { PaginationMeta } from '@/shared/types/api-feature';

const EMPLOYEE_SEARCHABLE_FIELDS = ['employeeCode', 'phone'];
const EMPLOYEE_FILTERABLE_FIELDS = ['employmentStatus', 'departmentId', 'positionId'];

export interface GetAllEmployeesResult {
  employees: EmployeeWithRelations[];
  pagination: PaginationMeta;
}

function normalizeAndValidate(rawQuery: URLSearchParams | Record<string, string>): {
  validated: EmployeeQueryInput;
  asObject: Record<string, string>;
} {
  const asObject =
    rawQuery instanceof URLSearchParams ? Object.fromEntries(rawQuery.entries()) : rawQuery;

  const parsed = employeeQuerySchema.safeParse(asObject);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new BadRequestError(ERROR_CODES.BAD_QUERY_PARAMS, message);
  }

  return { validated: parsed.data, asObject };
}

export async function getAllEmployees(
  rawQuery: URLSearchParams | Record<string, string>,
): Promise<GetAllEmployeesResult> {
  const { validated, asObject } = normalizeAndValidate(rawQuery);

  const features = new ApiFeaturesBuilder<
    Prisma.EmployeeWhereInput,
    Prisma.EmployeeOrderByWithRelationInput,
    Prisma.EmployeeSelect
  >(asObject, EMPLOYEE_SEARCHABLE_FIELDS, EMPLOYEE_FILTERABLE_FIELDS)
    .filter()
    .search()
    .sort('createdAt')
    .paginate();

  const query = features.build();

  if (validated.search) {
    const existingOr = (query.where as Prisma.EmployeeWhereInput | undefined)?.OR ?? [];

    query.where = {
      ...query.where,
      OR: [
        ...existingOr,
        { user: { firstName: { contains: validated.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: validated.search, mode: 'insensitive' } } },
        { user: { email: { contains: validated.search, mode: 'insensitive' } } },
      ],
    };
  }

  if (validated.accountStatus) {
    query.where = { ...query.where, user: { status: validated.accountStatus } };
  }

  const [employees, totalCount] = await Promise.all([
    employeeRepository.findMany(query),
    employeeRepository.count(query.where),
  ]);

  return {
    employees,
    pagination: features.getPaginationMeta(totalCount),
  };
}
