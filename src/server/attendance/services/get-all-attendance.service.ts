import type { Prisma } from '@/generated/prisma/client';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { attendanceRepository } from '@/server/attendance/repositories/attendance.repository';
import type { AttendanceQueryInput } from '@/server/attendance/schemas/get-all-attendance-query-schema';
import { attendanceQuerySchema } from '@/server/attendance/schemas/get-all-attendance-query-schema';
import type { AttendanceWithEmployee } from '@/server/attendance/types';
import { collectDepartmentAndDescendantIds } from '@/server/departments/lib/collect-department-descendant-ids';
import { departmentRepository } from '@/server/departments/repositories/department.repository';
import { ApiFeaturesBuilder } from '@/shared/builders/api-features.builder';
import type { PaginationMeta } from '@/shared/types/api-feature';
import { parseUtcDate } from '@/shared/utils/date';

const ATTENDANCE_FILTERABLE_FIELDS = ['status', 'completionStatus', 'employeeId'];

export interface GetAllAttendanceResult {
  attendance: AttendanceWithEmployee[];
  pagination: PaginationMeta;
}

function normalizeAndValidate(rawQuery: URLSearchParams | Record<string, string>): {
  validated: AttendanceQueryInput;
  asObject: Record<string, string>;
} {
  const asObject =
    rawQuery instanceof URLSearchParams ? Object.fromEntries(rawQuery.entries()) : rawQuery;

  const parsed = attendanceQuerySchema.safeParse(asObject);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new BadRequestError(ERROR_CODES.BAD_QUERY_PARAMS, message);
  }

  return { validated: parsed.data, asObject };
}

export async function getAllAttendance(
  rawQuery: URLSearchParams | Record<string, string>,
): Promise<GetAllAttendanceResult> {
  const { validated, asObject } = normalizeAndValidate(rawQuery);

  const features = new ApiFeaturesBuilder<
    Prisma.AttendanceWhereInput,
    Prisma.AttendanceOrderByWithRelationInput,
    Prisma.AttendanceSelect
  >(asObject, [], ATTENDANCE_FILTERABLE_FIELDS)
    .filter()
    .sort('date')
    .paginate();

  const query = features.build();

  // The requested sort field alone can tie (e.g. many records share the same date), and Postgres
  // doesn't guarantee a stable order for ties across queries — an unrelated update can shuffle a
  // record's row version and flip its position. Appending `id` as a tiebreaker keeps ordering
  // deterministic regardless of what else changed.
  query.orderBy = [...(query.orderBy ?? []), { id: 'desc' }];

  const employeeWhere: Prisma.EmployeeWhereInput = {};

  if (validated.departmentId) {
    const allDepartments = await departmentRepository.findAllForEmployeeRollup();
    const departmentIds = collectDepartmentAndDescendantIds(validated.departmentId, allDepartments);

    employeeWhere.departmentId = { in: departmentIds };
  }

  if (validated.search) {
    employeeWhere.OR = [
      { employeeCode: { contains: validated.search, mode: 'insensitive' } },
      { user: { firstName: { contains: validated.search, mode: 'insensitive' } } },
      { user: { lastName: { contains: validated.search, mode: 'insensitive' } } },
    ];
  }

  if (Object.keys(employeeWhere).length > 0) {
    query.where = { ...query.where, employee: employeeWhere };
  }

  if (validated.dateFrom || validated.dateTo) {
    const dateFilter: Prisma.DateTimeFilter = {};

    if (validated.dateFrom) {
      dateFilter.gte = parseUtcDate(validated.dateFrom);
    }

    if (validated.dateTo) {
      dateFilter.lte = parseUtcDate(validated.dateTo);
    }

    query.where = { ...query.where, date: dateFilter };
  }

  const [attendance, totalCount] = await Promise.all([
    attendanceRepository.findMany(query),
    attendanceRepository.count(query.where),
  ]);

  return {
    attendance,
    pagination: features.getPaginationMeta(totalCount),
  };
}
