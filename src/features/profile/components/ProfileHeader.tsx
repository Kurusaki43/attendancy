import { formatDistanceToNow } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/features/dashboard/components/UserAvatar';
import type { ProfileResult } from '@/server/profile/types/action-results';

type ProfileHeaderProps = {
  profile: ProfileResult;
};

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 pb-6">
      <UserAvatar
        firstName={profile.firstName}
        lastName={profile.lastName}
        avatar={profile.avatar}
        size="lg"
      />

      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight">
          {profile.firstName} {profile.lastName}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">{profile.email}</p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {profile.roles.map((role) => (
            <Badge key={role} variant="secondary">
              {role}
            </Badge>
          ))}
          <Badge variant="outline">{profile.provider}</Badge>
          <span className="text-muted-foreground text-xs">
            Member since {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
}
