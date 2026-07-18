import { Briefcase, CircleCheck, CircleX } from 'lucide-react';

import { StatCard } from '@/components/shared/StatCard';
import type { GetPositionStatsActionResult } from '@/server/positions/types/action-results';

type PositionStatsProps = {
  stats: GetPositionStatsActionResult;
};

export function PositionStats({ stats }: PositionStatsProps) {
  const cards = [
    {
      label: 'Total Positions',
      value: stats.totalPositions,
      caption: 'All positions',
      icon: Briefcase,
      iconClassName: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Active Positions',
      value: stats.activePositions,
      caption: 'Currently active',
      icon: CircleCheck,
      iconClassName: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Inactive Positions',
      value: stats.inactivePositions,
      caption: 'Currently inactive',
      icon: CircleX,
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
