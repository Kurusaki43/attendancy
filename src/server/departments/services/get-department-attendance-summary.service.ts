import { AttendanceStatus, EmploymentStatus, UserStatus } from '@/generated/prisma/enums';
import { attendanceRepository } from '@/server/attendance/repositories/attendance.repository';
import { collectDepartmentAndDescendantIds } from '@/server/departments/lib/collect-department-descendant-ids';
import { departmentRepository } from '@/server/departments/repositories/department.repository';
import { employeeRepository } from '@/server/employees/repositories/employee.repository';
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

  const allDepartments = await departmentRepository.findAllForEmployeeRollup();
  const departmentIds = collectDepartmentAndDescendantIds(departmentId, allDepartments);

  const [activeEmployees, presentToday, todayAttendance] = await Promise.all([
    employeeRepository.count({
      departmentId: { in: departmentIds },
      employmentStatus: EmploymentStatus.ACTIVE,
      user: { status: UserStatus.ACTIVE },
    }),
    attendanceRepository.count({
      date: today,
      status: AttendanceStatus.PRESENT,
      employee: { departmentId: { in: departmentIds } },
    }),

    attendanceRepository.findMany({
      where: { date: today, employee: { departmentId: { in: departmentIds } } },
    }),
  ]);

  const absentToday = Math.max(activeEmployees - presentToday, 0);

  const attendanceRate =
    activeEmployees === 0 ? 0 : Number(((presentToday / activeEmployees) * 100).toFixed(1));

  const totalWorkedMinutes = todayAttendance.reduce((sum, record) => sum + record.workedMinutes, 0);

  const averageWorkedMinutes =
    presentToday > 0 ? Math.round((totalWorkedMinutes / presentToday) * 10) / 10 : 0;

  return { presentToday, absentToday, attendanceRate, totalWorkedMinutes, averageWorkedMinutes };
}
