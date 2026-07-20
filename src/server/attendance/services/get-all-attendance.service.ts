import type { Prisma } from '@/generated/prisma/client';
import { BadRequestError } from '@/lib/errors/bad-request.error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import { attendanceRepository } from '@/server/attendance/repositories/attendance.repository';
import type { AttendanceQueryInput } from '@/server/attendance/schemas/get-all-attendance-query-schema';
import { attendanceQuerySchema } from '@/server/attendance/schemas/get-all-attendance-query-schema';
import type { AttendanceWithEmployee } from '@/server/attendance/types';
import { ApiFeaturesBuilder } from '@/shared/builders/api-features.builder';
import type { PaginationMeta } from '@/shared/types/api-feature';

const ATTENDANCE_FILTERABLE_FIELDS = ['status', 'employeeId'];

// Parses a 'YYYY-MM-DD' string as a local-midnight Date directly, rather than going through
// `new Date(isoString)` (which parses date-only strings as UTC midnight) followed by a
// local-timezone conversion — that round trip can shift the date by a day depending on the
// server's timezone offset from UTC.
function parseLocalDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

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

  const employeeWhere: Prisma.EmployeeWhereInput = {};

  if (validated.departmentId) {
    employeeWhere.departmentId = validated.departmentId;
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

  // date is always stored as a calendar day's midnight instant (see
  // findOrCreateTodayAttendance), so a plain gte/lte against day boundaries is correct here —
  // no need for an exclusive upper bound like a datetime range would need.
  if (validated.dateFrom || validated.dateTo) {
    const dateFilter: Prisma.DateTimeFilter = {};

    if (validated.dateFrom) {
      dateFilter.gte = parseLocalDate(validated.dateFrom);
    }

    if (validated.dateTo) {
      dateFilter.lte = parseLocalDate(validated.dateTo);
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
