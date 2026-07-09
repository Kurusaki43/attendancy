import { Inbox, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-1 px-6 py-12 text-center',
        className,
      )}
    >
      <div className="bg-muted/60 mb-3 flex size-12 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground size-6" strokeWidth={1.5} />
      </div>

      <p className="text-foreground text-sm font-medium">{title}</p>

      {description && (
        <p className="text-muted-foreground max-w-sm text-sm text-balance">{description}</p>
      )}

      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
