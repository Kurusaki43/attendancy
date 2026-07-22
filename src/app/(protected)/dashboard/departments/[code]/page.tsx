import { notFound } from 'next/navigation';

import { DepartmentAttendanceSummaryCards } from '@/features/departments/components/detail/DepartmentAttendanceSummaryCards';
import { DepartmentDetailHeader } from '@/features/departments/components/detail/DepartmentDetailHeader';
import { DepartmentDetailTabs } from '@/features/departments/components/detail/DepartmentDetailTabs';
import { DepartmentInfoCard } from '@/features/departments/components/detail/DepartmentInfoCard';
import { DepartmentOverviewCard } from '@/features/departments/components/detail/DepartmentOverviewCard';
import { getAllAttendanceAction } from '@/server/attendance/actions/get-all-attendance.action';
import { getAllDepartmentsAction } from '@/server/departments/actions/get-all-departments.action';
import { getDepartmentAttendanceSummaryAction } from '@/server/departments/actions/get-department-attendance-summary.action';
import { getDepartmentDetailAction } from '@/server/departments/actions/get-department-detail.action';
import { getAllEmployeesAction } from '@/server/employees/actions/get-all-employees.action';

type DepartmentDetailPageProps = {
  params: Promise<{ code: string }>;
};

export default async function DepartmentDetailPage({ params }: DepartmentDetailPageProps) {
  const { code } = await params;

  const departmentResult = await getDepartmentDetailAction(code);

  if (!departmentResult.success) {
    notFound();
  }

  const department = departmentResult.data;

  const [employeesResult, attendanceResult, childDepartmentsResult, attendanceSummaryResult] =
    await Promise.all([
      getAllEmployeesAction({ departmentId: department.id, limit: '5', sort: 'name' }),
      getAllAttendanceAction({ departmentId: department.id, limit: '5', sort: '-date' }),
      getAllDepartmentsAction({ parentId: department.id, limit: '5', sort: 'name' }),
      getDepartmentAttendanceSummaryAction(department.id),
    ]);

  const attendanceSummary = attendanceSummaryResult.success
    ? attendanceSummaryResult.data
    : {
        presentToday: 0,
        absentToday: 0,
        attendanceRate: 0,
        totalWorkedMinutes: 0,
        averageWorkedMinutes: 0,
      };

  return (
    <div className="space-y-6">
      <DepartmentDetailHeader department={department} />

      <div className="flex flex-col gap-4 sm:flex-row">
        <DepartmentInfoCard department={department} />
        <DepartmentOverviewCard overview={department.overview} />
      </div>

      <DepartmentAttendanceSummaryCards summary={attendanceSummary} />

      <DepartmentDetailTabs
        departmentId={department.id}
        employees={employeesResult.success ? employeesResult.data.employees : null}
        employeesErrorCode={employeesResult.success ? undefined : employeesResult.code}
        attendance={attendanceResult.success ? attendanceResult.data.attendance : null}
        attendanceErrorCode={attendanceResult.success ? undefined : attendanceResult.code}
        childDepartments={
          childDepartmentsResult.success ? childDepartmentsResult.data.departments : null
        }
        childDepartmentsErrorCode={
          childDepartmentsResult.success ? undefined : childDepartmentsResult.code
        }
      />
    </div>
  );
}
