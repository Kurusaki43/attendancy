import { ShieldCheck, ShieldOff, UserRound } from 'lucide-react';

import { getListErrorStateProps } from '@/components/shared/data-table/data-table-utils';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
          <TabsTrigger value="profile">
            <UserRound data-icon="inline-start" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck data-icon="inline-start" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="pt-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-base">Personal Information</CardTitle>
              <CardDescription>Update your name and profile photo.</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ProfileForm profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="pt-4">
          {profile.hasPassword ? (
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-base">Change Password</CardTitle>
                <CardDescription>
                  Choose a strong password. Changing it signs you out of every other session.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ChangePasswordForm />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <EmptyState
                  icon={ShieldOff}
                  title="No password set"
                  description={`Your account signs in with ${profile.provider.toLowerCase()}, so there's no password to change here.`}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
