import { format, formatDistanceToNow } from 'date-fns';
import { BadgeCheck, CalendarDays, KeyRound, ShieldCheck, User, Users } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logoutAction } from '@/features/auth/actions/logout.action';
import { LogoutButton } from '@/features/auth/components/LogoutButton';
import { getCurrentUser } from '@/features/auth/lib/get-current-user';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const permissions = user.roles.flatMap((role) => role.permissions);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Welcome, {user.firstName} 👋</h1>

          <p className="text-muted-foreground mt-1">
            Manage your attendance, profile, and permissions.
          </p>
        </div>

        <form action={logoutAction}>
          <LogoutButton />
        </form>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <User className="size-5 text-violet-500" />

            <CardTitle>Profile</CardTitle>

            <CardDescription>Basic account information.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Name:</span> {user.firstName} {user.lastName}
            </p>

            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>

            <p>
              <span className="font-medium">Provider:</span> {user.provider}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ShieldCheck className="size-5 text-green-500" />

            <CardTitle>Security</CardTitle>

            <CardDescription>Verification and account status.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Status:</span> {user.status}
            </p>

            <p>
              <span className="font-medium">Email Verified:</span>{' '}
              {user.emailVerifiedAt ? '✅ Yes' : '❌ No'}
            </p>

            <p>
              <span className="font-medium">Password Login:</span>{' '}
              {user.passwordHash ? 'Enabled' : 'OAuth Only'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CalendarDays className="size-5 text-blue-500" />

            <CardTitle>Account</CardTitle>

            <CardDescription>Membership and account activity.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium">Joined</p>

              <p className="text-muted-foreground">{format(user.createdAt, 'MMMM d, yyyy')}</p>

              <p className="text-muted-foreground/80 text-xs">
                {formatDistanceToNow(user.createdAt, {
                  addSuffix: true,
                })}
              </p>
            </div>

            <div>
              <p className="font-medium">Last Updated</p>

              <p className="text-muted-foreground">
                {format(user.updatedAt, 'MMMM d, yyyy • h:mm a')}
              </p>

              <p className="text-muted-foreground/80 text-xs">
                {formatDistanceToNow(user.updatedAt, {
                  addSuffix: true,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-background/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-violet-500" />
              Roles
            </CardTitle>

            <CardDescription>Assigned roles for the current user.</CardDescription>
          </CardHeader>

          <CardContent>
            {user.roles.length === 0 ? (
              <p className="text-muted-foreground text-sm">No roles assigned.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <div
                    key={role.id}
                    className="border-border bg-muted rounded-md border px-3 py-1 text-sm"
                  >
                    {role.name}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="size-5 text-amber-500" />
              Permissions
            </CardTitle>

            <CardDescription>Effective permissions from all roles.</CardDescription>
          </CardHeader>

          <CardContent>
            {permissions.length === 0 ? (
              <p className="text-muted-foreground text-sm">No permissions available.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-xs"
                  >
                    {permission.action}:{permission.resource}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeCheck className="size-5 text-green-500" />
            Authentication Status
          </CardTitle>

          <CardDescription>Your authentication system is functioning correctly.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="border-border/50 bg-muted/30 rounded-xl border border-dashed p-8">
            <ul className="space-y-2 text-sm">
              <li>✅ User session loaded successfully</li>
              <li>✅ Protected routes are accessible</li>
              <li>✅ Roles and permissions resolved</li>
              <li>✅ Email verification state available</li>
              <li>✅ Logout functionality operational</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
