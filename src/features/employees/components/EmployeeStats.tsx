import { UserRoundCheck, UserRoundMinus, UserRoundX, Users } from 'lucide-react';

import { StatCard } from '@/components/shared/StatCard';
import type { GetEmployeeStatsActionResult } from '@/server/employees/types/action-results';

type EmployeeStatsProps = {
  stats: GetEmployeeStatsActionResult;
};

function percentOfTotal(value: number, total: number) {
  if (total === 0) return '0% of total';
  return `${((value / total) * 100).toFixed(1)}% of total`;
}

export function EmployeeStats({ stats }: EmployeeStatsProps) {
  const { totalEmployees } = stats;

  const cards = [
    {
      label: 'Total Employees',
      value: totalEmployees,
      caption: 'All employees',
      icon: Users,
      iconClassName: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Active Employees',
      value: stats.activeEmployees,
      caption: percentOfTotal(stats.activeEmployees, totalEmployees),
      icon: UserRoundCheck,
      iconClassName: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'On Leave',
      value: stats.onLeaveEmployees,
      caption: percentOfTotal(stats.onLeaveEmployees, totalEmployees),
      icon: UserRoundMinus,
      iconClassName: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Inactive Employees',
      value: stats.inactiveEmployees,
      caption: percentOfTotal(stats.inactiveEmployees, totalEmployees),
      icon: UserRoundX,
      iconClassName: 'bg-red-500/15 text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
