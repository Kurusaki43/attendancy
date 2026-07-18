import type { LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StatCardProps = {
  label: string;
  value: string | number;
  caption?: string;
  icon: LucideIcon;
  iconClassName?: string;
  className?: string;
};

export function StatCard({
  label,
  value,
  caption,
  icon: Icon,
  iconClassName,
  className,
}: StatCardProps) {
  return (
    <Card size="sm" className={cn(className, 'rounded-sm py-2.5')}>
      <CardContent className="flex items-center gap-4">
        <span
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-xl',
            iconClassName ?? 'bg-primary/10 text-primary',
          )}
        >
          <Icon className="size-6" />
        </span>
        <div className="min-w-0 space-y-1 xl:space-y-2">
          <p className="text-muted-foreground text-sm font-semibold tracking-wider">{label}</p>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          {caption && <p className="text-muted-foreground text-xs">{caption}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
