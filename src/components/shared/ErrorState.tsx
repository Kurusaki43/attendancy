'use client';

import { type LucideIcon, RefreshCw, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ErrorStateProps = {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  icon: Icon = TriangleAlert,
  title = "Couldn't load data",
  description = 'Something went wrong while fetching this data.',
  onRetry,
  className,
}: ErrorStateProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-1 px-6 py-12 text-center',
        className,
      )}
    >
      <div className="bg-destructive/10 mb-3 flex size-12 items-center justify-center rounded-full">
        <Icon className="text-destructive size-6" strokeWidth={1.5} />
      </div>

      <p className="text-foreground text-sm font-medium">{title}</p>

      {description && (
        <p className="text-muted-foreground max-w-sm text-sm text-balance">{description}</p>
      )}

      <Button
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={onRetry ?? (() => router.refresh())}
      >
        <RefreshCw data-icon="inline-start" />
        Try Again
      </Button>
    </div>
  );
}
