import { Building2, Gauge, Users } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const STATS = [
  {
    label: 'Total Departments',
    value: '12',
    caption: 'All departments',
    icon: Building2,
    iconClassName: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  },
  {
    label: 'Total Employees',
    value: '128',
    caption: 'Across all departments',
    icon: Users,
    iconClassName: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  {
    label: 'Average Department Size',
    value: '10.7',
    caption: 'Employees per department',
    icon: Gauge,
    iconClassName: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  },
];

export function DepartmentStats() {
  return (
    <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STATS.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} size="sm">
            <CardContent className="flex items-center gap-4">
              <span
                className={cn(
                  'flex size-12 shrink-0 items-center justify-center rounded-xl',
                  stat.iconClassName,
                )}
              >
                <Icon className="size-6" />
              </span>
              <div className="min-w-0 space-y-1 xl:space-y-2">
                <p className="text-muted-foreground text-sm font-semibold tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-muted-foreground text-xs">{stat.caption}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
