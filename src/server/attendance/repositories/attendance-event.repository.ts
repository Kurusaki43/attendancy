import type { AttendanceEventUncheckedCreateInput } from '@/generated/prisma/models';
import { prisma } from '@/lib/prisma';

export const attendanceEventRepository = {
  create(data: AttendanceEventUncheckedCreateInput) {
    return prisma.attendanceEvent.create({ data });
  },

  findByAttendanceId(attendanceId: string) {
    return prisma.attendanceEvent.findMany({
      where: { attendanceId },
      orderBy: { occurredAt: 'asc' },
    });
  },

  findLastByAttendanceId(attendanceId: string) {
    return prisma.attendanceEvent.findFirst({
      where: { attendanceId },
      orderBy: { occurredAt: 'desc' },
    });
  },

  delete(eventId: string) {
    return prisma.attendanceEvent.delete({ where: { id: eventId } });
  },
};
