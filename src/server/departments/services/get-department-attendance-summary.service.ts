import { AttendanceStatus } from '@/generated/prisma/enums';
import { attendanceRepository } from '@/server/attendance/repositories/attendance.repository';
import { startOfUtcDay } from '@/shared/utils/date';

export type DepartmentAttendanceOverview = {
  presentToday: number;
  absentToday: number;
  attendanceRate: number;
  totalWorkedMinutes: number;
  averageWorkedMinutes: number;
};

export async function getDepartmentAttendanceSummary(
  departmentId: string,
): Promise<DepartmentAttendanceOverview> {
  const today = startOfUtcDay();

  const todayAttendance = await attendanceRepository.findMany({
    where: { date: today, employee: { departmentId } },
  });

  const presentToday = todayAttendance.filter(
    (record) => record.status === AttendanceStatus.PRESENT,
  ).length;

  const absentToday = todayAttendance.filter(
    (record) => record.status === AttendanceStatus.ABSENT,
  ).length;

  const attendanceRate =
    todayAttendance.length > 0
      ? Math.round((presentToday / todayAttendance.length) * 1000) / 10
      : 0;

  const totalWorkedMinutes = todayAttendance.reduce((sum, record) => sum + record.workedMinutes, 0);

  const averageWorkedMinutes =
    presentToday > 0 ? Math.round((totalWorkedMinutes / presentToday) * 10) / 10 : 0;

  return { presentToday, absentToday, attendanceRate, totalWorkedMinutes, averageWorkedMinutes };
}
