import { formatDistanceToNow } from 'date-fns';
import { HelpCircle, Monitor, Smartphone, Tablet } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SessionResult } from '@/server/auth/types/action-results';

import { RevokeSessionDialog } from './RevokeSessionDialog';

const DEVICE_CONFIG = {
  desktop: {
    icon: Monitor,
    iconClassName: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    gradientClassName: 'from-blue-500/10',
  },
  mobile: {
    icon: Smartphone,
    iconClassName: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    gradientClassName: 'from-emerald-500/10',
  },
  tablet: {
    icon: Tablet,
    iconClassName: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    gradientClassName: 'from-amber-500/10',
  },
  unknown: {
    icon: HelpCircle,
    iconClassName: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
    gradientClassName: 'from-slate-500/10',
  },
} as const;

function formatDateTime(date: Date) {
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatRelative(date: Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

type SessionCardProps = {
  session: SessionResult;
};

export function SessionCard({ session }: SessionCardProps) {
  const { icon: DeviceIcon, iconClassName, gradientClassName } = DEVICE_CONFIG[session.deviceType];

  return (
    <Card
      className={cn(
        'gap-3 bg-gradient-to-br to-transparent px-4',
        gradientClassName,
        session.isCurrent && 'ring-primary/40 ring-2',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full',
              iconClassName,
            )}
          >
            <DeviceIcon className="size-5" strokeWidth={1.75} />
          </div>

          <div>
            <p className="text-foreground text-sm font-semibold">
              {session.browser} on {session.os}
            </p>
            <p className="text-muted-foreground text-xs">{session.ipAddress ?? 'Unknown IP'}</p>
          </div>
        </div>

        {session.isCurrent ? (
          <Badge variant="outline" className="bg-green-600 text-white">
            Current
          </Badge>
        ) : (
          <RevokeSessionDialog session={session} />
        )}
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <dt className="text-muted-foreground">Created</dt>
        <dd className="text-foreground text-right" title={formatDateTime(session.createdAt)}>
          {formatRelative(session.createdAt)}
        </dd>

        <dt className="text-muted-foreground">Last active</dt>
        <dd className="text-foreground text-right" title={formatDateTime(session.updatedAt)}>
          {formatRelative(session.updatedAt)}
        </dd>

        <dt className="text-muted-foreground">Expires</dt>
        <dd className="text-foreground text-right" title={formatDateTime(session.expiresAt)}>
          {formatRelative(session.expiresAt)}
        </dd>
      </dl>
    </Card>
  );
}
