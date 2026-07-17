import { Building2, Gauge, Users } from 'lucide-react';

import { StatCard } from '@/components/shared/StatCard';
import type { GetDepartmentStatsActionResult } from '@/server/departments/types/action-results';

type DepartmentStatsProps = {
  stats: GetDepartmentStatsActionResult;
};

export function DepartmentStats({ stats }: DepartmentStatsProps) {
  const cards = [
    {
      label: 'Total Departments',
      value: stats.totalDepartments,
      caption: 'All departments',
      icon: Building2,
      iconClassName: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Total Employees',
      value: stats.totalEmployees,
      caption: 'Across all departments',
      icon: Users,
      iconClassName: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Average Department Size',
      value: stats.averageDepartmentSize,
      caption: 'Employees per department',
      icon: Gauge,
      iconClassName: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
    },
  ];

  return (
    <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
