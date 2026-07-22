import type { LucideIcon } from 'lucide-react';
import { Briefcase, CheckCircle2, Network, Users, Users2 } from 'lucide-react';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DepartmentOverview } from '@/server/departments/types/action-results';

type DepartmentOverviewCardProps = {
  overview: DepartmentOverview;
};

type OverviewRow = {
  key: string;
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  value: string;
};

export function DepartmentOverviewCard({ overview }: DepartmentOverviewCardProps) {
  const rows: OverviewRow[] = [
    {
      key: 'total',
      icon: Users,
      iconClassName: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
      label: 'Total Employees',
      value: String(overview.totalEmployees),
    },
    {
      key: 'active',
      icon: CheckCircle2,
      iconClassName: 'bg-green-500/15 text-green-600 dark:text-green-400',
      label: 'Active Employees',
      value: String(overview.activeEmployees),
    },
    {
      key: 'children',
      icon: Network,
      iconClassName: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
      label: 'Sub-departments',
      value: String(overview.childrenCount),
    },
    {
      key: 'positions',
      icon: Briefcase,
      iconClassName: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
      label: 'Positions',
      value: String(overview.positionCount),
    },
    {
      key: 'managers',
      icon: Users2,
      iconClassName: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
      label: 'Managers',
      value: String(overview.managerCount),
    },
  ];

  return (
    <Card className="bg-card border-border card-shadow w-full sm:w-80">
      <CardContent className="flex flex-col gap-4">
        <CardTitle>Department Overview</CardTitle>

        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-md',
                    row.iconClassName,
                  )}
                >
                  <row.icon className="size-4" />
                </span>
                <span className="text-muted-foreground text-sm">{row.label}</span>
              </div>
              <span className="text-foreground text-sm font-semibold">{row.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
