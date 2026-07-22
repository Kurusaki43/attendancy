import { Building2, CheckCircle2, Gauge, XCircle } from 'lucide-react';

import { StatCard } from '@/components/shared/StatCard';
import type { GetDepartmentStatsActionResult } from '@/server/departments/types/action-results';

type DepartmentStatsProps = {
  stats: GetDepartmentStatsActionResult;
};

function percentOfTotal(value: number, total: number) {
  if (total === 0) return '0% of total';
  return `${((value / total) * 100).toFixed(1)}% of total`;
}

export function DepartmentStats({ stats }: DepartmentStatsProps) {
  const { totalDepartments } = stats;

  const cards = [
    {
      label: 'Total Departments',
      value: totalDepartments,
      caption: 'All departments',
      icon: Building2,
      iconClassName: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Active Departments',
      value: stats.activeDepartments,
      caption: percentOfTotal(stats.activeDepartments, totalDepartments),
      icon: CheckCircle2,
      iconClassName: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Inactive Departments',
      value: stats.inactiveDepartments,
      caption: percentOfTotal(stats.inactiveDepartments, totalDepartments),
      icon: XCircle,
      iconClassName: 'bg-red-500/15 text-red-600 dark:text-red-400',
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
    <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
