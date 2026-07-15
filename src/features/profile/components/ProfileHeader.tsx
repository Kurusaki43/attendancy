import { formatDistanceToNow } from 'date-fns';
import { CalendarDays, Globe, Lock, MailCheck, MailWarning } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from '@/features/dashboard/components/UserAvatar';
import type { ProfileResult } from '@/server/profile/types/action-results';

type ProfileHeaderProps = {
  profile: ProfileResult;
};

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const isEmailVerified = Boolean(profile.emailVerifiedAt);

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="from-primary/20 via-primary/5 h-20 bg-gradient-to-br to-transparent sm:h-24" />

      <CardContent className="relative px-6 pt-0 pb-6">
        <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <UserAvatar
              firstName={profile.firstName}
              lastName={profile.lastName}
              avatar={profile.avatar}
              size="xl"
              className="ring-background shadow-lg ring-4"
            />

            <div className="pb-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-muted-foreground mt-0.5 text-sm">{profile.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:pb-1.5">
            {profile.roles.map((role) => (
              <Badge key={role} variant="secondary">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="my-5" />

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="bg-muted/60 flex size-9 shrink-0 items-center justify-center rounded-full">
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

          <div className="flex items-center gap-3">
            <div
              className={
                isEmailVerified
                  ? 'flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10'
                  : 'bg-destructive/10 flex size-9 shrink-0 items-center justify-center rounded-full'
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

          <div className="flex items-center gap-3">
            <div className="bg-muted/60 flex size-9 shrink-0 items-center justify-center rounded-full">
              <CalendarDays className="text-muted-foreground size-4" strokeWidth={1.75} />
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Member since</dt>
              <dd
                className="text-sm font-medium"
                title={new Date(profile.createdAt).toLocaleDateString('en-US', {
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
