import { Activity, ShieldCheck, User } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logoutAction } from '@/features/auth/actions/logout.action';
import { LogoutButton } from '@/features/auth/components/LogoutButton';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Dashboard</h1>

          <p className="text-muted-foreground mt-1">
            Authentication flow is working successfully 🎉
          </p>
        </div>

        <form action={logoutAction}>
          <LogoutButton />
        </form>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <User className="text-violet-500" />
            <CardTitle>Profile</CardTitle>
            <CardDescription>User information and preferences.</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <ShieldCheck className="text-green-500" />
            <CardTitle>Security</CardTitle>
            <CardDescription>Email verification and session status.</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Activity className="text-blue-500" />
            <CardTitle>Activity</CardTitle>
            <CardDescription>Recent actions and events.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-background/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Protected Content</CardTitle>

          <CardDescription>
            If you can see this page, authentication, authorization, middleware, cookies, and
            session handling are functioning correctly.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="border-border/50 bg-muted/30 rounded-xl border border-dashed p-8 text-center">
            <p className="text-muted-foreground">
              Replace this with your real dashboard components later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
