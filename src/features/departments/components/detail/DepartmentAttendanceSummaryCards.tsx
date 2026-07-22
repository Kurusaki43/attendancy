import { CheckCircle2, Clock, Percent, Timer, XCircle } from 'lucide-react';

import { StatCard } from '@/components/shared/StatCard';
import { formatWorkedMinutes } from '@/features/attendance/lib/format-worked-date';
import type { GetDepartmentAttendanceSummaryActionResult } from '@/server/departments/types/action-results';

type DepartmentAttendanceSummaryCardsProps = {
  summary: GetDepartmentAttendanceSummaryActionResult;
};

export function DepartmentAttendanceSummaryCards({
  summary,
}: DepartmentAttendanceSummaryCardsProps) {
  const cards = [
    {
      label: 'Present Today',
      value: summary.presentToday,
      caption: "Today's headcount",
      icon: CheckCircle2,
      iconClassName: 'bg-green-500/15 text-green-600 dark:text-green-400',
    },
    {
      label: 'Absent Today',
      value: summary.absentToday,
      caption: "Today's headcount",
      icon: XCircle,
      iconClassName: 'bg-red-500/15 text-red-600 dark:text-red-400',
    },
    {
      label: 'Attendance Rate',
      value: `${summary.attendanceRate}%`,
      caption: 'Present of all records today',
      icon: Percent,
      iconClassName: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Total Worked',
      value: formatWorkedMinutes(summary.totalWorkedMinutes),
      caption: 'Across present employees',
      icon: Clock,
      iconClassName: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Avg. Worked',
      value: formatWorkedMinutes(Math.round(summary.averageWorkedMinutes)),
      caption: 'Per present employee',
      icon: Timer,
      iconClassName: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
