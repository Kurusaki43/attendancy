import type { Prisma } from '@/generated/prisma/client';
import type {
  AttendanceUncheckedCreateInput,
  AttendanceUncheckedUpdateInput,
} from '@/generated/prisma/models';
import { prisma } from '@/lib/prisma';
import type { PrismaQueryOptions } from '@/shared/types/api-feature';

const ATTENDANCE_EMPLOYEE_SELECT = {
  id: true,
  employeeCode: true,
  user: { select: { firstName: true, lastName: true, avatar: true } },
  department: { select: { id: true, name: true, code: true, icon: true, color: true } },
  position: { select: { id: true, title: true } },
} satisfies Prisma.EmployeeSelect;

export const ATTENDANCE_INCLUDE = {
  events: { orderBy: { occurredAt: 'asc' } },
  employee: { select: ATTENDANCE_EMPLOYEE_SELECT },
} satisfies Prisma.AttendanceInclude;

export const ATTENDANCE_LIST_INCLUDE = {
  employee: { select: ATTENDANCE_EMPLOYEE_SELECT },
} satisfies Prisma.AttendanceInclude;

export type AttendanceFindManyQuery = PrismaQueryOptions<
  Prisma.AttendanceWhereInput,
  Prisma.AttendanceOrderByWithRelationInput,
  Prisma.AttendanceSelect
>;

export type AttendanceWithEvents = Prisma.AttendanceGetPayload<{
  include: typeof ATTENDANCE_INCLUDE;
}>;

export type AttendanceWithEmployee = Prisma.AttendanceGetPayload<{
  include: typeof ATTENDANCE_LIST_INCLUDE;
}>;

export const attendanceRepository = {
  create(data: AttendanceUncheckedCreateInput) {
    return prisma.attendance.create({ data, include: ATTENDANCE_INCLUDE });
  },

  findById(attendanceId: string) {
    return prisma.attendance.findUnique({
      where: { id: attendanceId },
      include: ATTENDANCE_INCLUDE,
    });
  },

  findByEmployeeAndDate(employeeId: string, date: Date) {
    return prisma.attendance.findUnique({
      where: { employeeId_date: { employeeId, date } },
      include: ATTENDANCE_INCLUDE,
    });
  },

  update(attendanceId: string, newData: AttendanceUncheckedUpdateInput) {
    return prisma.attendance.update({
      where: { id: attendanceId },
      data: newData,
      include: ATTENDANCE_INCLUDE,
    });
  },

  delete(attendanceId: string) {
    return prisma.attendance.delete({ where: { id: attendanceId } });
  },

  findMany(query: AttendanceFindManyQuery) {
    return prisma.attendance.findMany({ ...query, include: ATTENDANCE_LIST_INCLUDE });
  },

  count(where?: Prisma.AttendanceWhereInput) {
    return prisma.attendance.count({ where });
  },
};
