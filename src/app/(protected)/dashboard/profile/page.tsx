import { ShieldOff } from 'lucide-react';

import { getListErrorStateProps } from '@/components/shared/data-table/data-table-utils';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
        className="border-border bg-card card-shadow rounded-sm"
      />
    );
  }

  const profile = result.data;

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="pb-6">
        <h1 className="text-2xl font-semibold tracking-wide">Profile</h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Manage your personal information and account security.
        </p>
      </div>

      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Personal Information</CardTitle>
            <CardDescription>Update your name and profile photo.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <ProfileForm profile={profile} />
          </CardContent>
        </Card>

        {profile.hasPassword ? (
          <Card className="shadow-sm">
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
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <EmptyState
                icon={ShieldOff}
                title="No password set"
                description={`Your account signs in with ${profile.provider.toLowerCase()}, so there's no password to change here.`}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
