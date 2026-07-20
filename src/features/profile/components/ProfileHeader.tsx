import { formatDistanceToNow } from 'date-fns';
import { CalendarDays, Globe, Lock, MailCheck, MailWarning } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from '@/features/dashboard/components/UserAvatar';
import type { ProfileResult } from '@/server/profile/types/action-results';
import { formatDate } from '@/shared/utils/format-date';

type ProfileHeaderProps = {
  profile: ProfileResult;
};

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const isEmailVerified = Boolean(profile.emailVerifiedAt);

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <CardContent className="relative px-6 pt-6 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <UserAvatar
              firstName={profile.firstName}
              lastName={profile.lastName}
              avatar={profile.avatar}
              size="xl"
              className="ring-background shadow-xl ring-4 transition-transform duration-300 ease-out hover:scale-[1.03]"
              showStatus
            />

            <div className="pb-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-muted-foreground mt-0.5 text-sm">{profile.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:pb-1.5">
            {profile.roles.map((role) => (
              <Badge
                key={role}
                variant="default"
                className="flex h-6 items-center rounded-lg px-2.5 py-0 text-xs leading-none font-semibold tracking-wider lowercase"
              >
                {role}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-5 opacity-60" />

        <dl className="grid grid-cols-1 gap-1 sm:grid-cols-3">
          <div className="hover:bg-muted/40 flex items-center gap-3 rounded-none p-2 transition-colors duration-200">
            <div className="bg-muted/60 flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-200">
              {profile.provider === 'GOOGLE' ? (
                <Globe className="text-muted-foreground size-4" strokeWidth={1.75} />
              ) : (
                <Lock className="text-muted-foreground size-4" strokeWidth={1.75} />
              )}
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Sign-in method</dt>
              <dd className="text-sm font-medium capitalize">{profile.provider.toLowerCase()}</dd>
            </div>
          </div>

          <div className="hover:bg-muted/40 flex items-center gap-3 rounded-none p-2 transition-colors duration-200">
            <div
              className={
                isEmailVerified
                  ? 'flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 transition-transform duration-200'
                  : 'bg-destructive/10 flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-200'
              }
            >
              {isEmailVerified ? (
                <MailCheck
                  className="text-emerald-600 dark:text-emerald-400"
                  strokeWidth={1.75}
                  size={16}
                />
              ) : (
                <MailWarning className="text-destructive size-4" strokeWidth={1.75} />
              )}
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Email status</dt>
              <dd className="text-sm font-medium">{isEmailVerified ? 'Verified' : 'Unverified'}</dd>
            </div>
          </div>

          <div className="hover:bg-muted/40 flex items-center gap-3 rounded-none p-2 transition-colors duration-200">
            <div className="bg-muted/60 flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-200">
              <CalendarDays className="text-muted-foreground size-4" strokeWidth={1.75} />
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Member since</dt>
              <dd
                className="text-sm font-medium"
                title={formatDate(profile.createdAt, {
                  locale: profile.locale,
                  timezone: profile.timezone,
                  dateStyle: 'long',
                })}
              >
                {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
              </dd>
            </div>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
