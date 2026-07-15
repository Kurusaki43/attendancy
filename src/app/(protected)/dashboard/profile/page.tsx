import { ShieldOff } from 'lucide-react';

import { getListErrorStateProps } from '@/components/shared/data-table/data-table-utils';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChangePasswordForm } from '@/features/profile/components/ChangePasswordForm';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { getProfileAction } from '@/server/profile/actions/get-profile.action';

export default async function ProfilePage() {
  const result = await getProfileAction();

  if (!result.success) {
    return (
      <ErrorState
        {...getListErrorStateProps(result.code, { resourceLabel: 'profile' })}
        className="rounded-md border"
      />
    );
  }

  const profile = result.data;

  return (
    <div className="space-y-4">
      <ProfileHeader profile={profile} />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="pt-6">
          <ProfileForm profile={profile} />
        </TabsContent>

        <TabsContent value="security" className="pt-6">
          {profile.hasPassword ? (
            <ChangePasswordForm />
          ) : (
            <EmptyState
              icon={ShieldOff}
              title="No password set"
              description={`Your account signs in with ${profile.provider}, so there's no password to change here.`}
              className="rounded-md border"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
