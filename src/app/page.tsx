import { ArrowRight, CalendarCheck2, Clock3, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-end px-6 pt-6">
        <ThemeToggle />
      </header>

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2">
          <CalendarCheck2 className="size-4 text-violet-500" />
          <span className="text-sm font-medium text-violet-500">Smart Attendance Management</span>
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-6xl">
          Manage attendance
          <span className="text-violet-500"> effortlessly</span>
        </h1>

        <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
          Track employee attendance, monitor working hours, and manage schedules with a fast,
          modern, and secure platform.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-500">
              Get Started
              <ArrowRight className="size-4" />
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-3">
        <Card className="bg-background/40 backdrop-blur-xl">
          <CardContent className="space-y-4 p-6">
            <Clock3 className="size-10 text-violet-500" />

            <h3 className="text-xl font-semibold">Real-Time Tracking</h3>

            <p className="text-muted-foreground text-sm leading-6">
              Monitor attendance and working hours instantly from a centralized dashboard.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background/40 backdrop-blur-xl">
          <CardContent className="space-y-4 p-6">
            <CalendarCheck2 className="size-10 text-violet-500" />

            <h3 className="text-xl font-semibold">Easy Management</h3>

            <p className="text-muted-foreground text-sm leading-6">
              Organize schedules, leaves, and attendance records with a simple workflow.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background/40 backdrop-blur-xl">
          <CardContent className="space-y-4 p-6">
            <ShieldCheck className="size-10 text-violet-500" />

            <h3 className="text-xl font-semibold">Secure by Default</h3>

            <p className="text-muted-foreground text-sm leading-6">
              Email verification, password recovery, and protected sessions keep your organization
              safe.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
