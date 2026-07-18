import type { LucideIcon } from 'lucide-react';
import { Briefcase, Building2, Calendar, Mail, ShieldCheck, User, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAvatar } from '@/features/dashboard/components/UserAvatar';

type EmployeeSummaryCardProps = {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null | undefined;
  departmentLabel: string | undefined;
  positionLabel: string | undefined;
  managerLabel: string | undefined;
  hireDateLabel: string | undefined;
  isActive: boolean | undefined;
};

function SummaryRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-muted-foreground flex items-center gap-2">
        <Icon className="size-4 shrink-0" />
        {label}
      </span>
      <span className="font-semibold">{children}</span>
    </div>
  );
}

export function EmployeeSummaryCard({
  firstName,
  lastName,
  email,
  avatar,
  departmentLabel,
  positionLabel,
  managerLabel,
  hireDateLabel,
  isActive,
}: EmployeeSummaryCardProps) {
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <Card>
      <CardHeader className="flex items-start justify-between gap-3 space-y-0">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
            <User className="size-5" />
          </div>
          <div>
            <CardTitle>Employee Summary</CardTitle>
            <CardDescription>Overview of employee information and status</CardDescription>
          </div>
        </div>

        <UserAvatar
          firstName={firstName}
          lastName={lastName}
          avatar={avatar}
          size="lg"
          className="ring-background shrink-0 shadow-sm ring-2"
        />
      </CardHeader>

      <CardContent>
        <div className="divide-y rounded-md border text-sm">
          <SummaryRow icon={User} label="Full Name">
            {fullName || 'Employee Name'}
          </SummaryRow>
          <SummaryRow icon={Mail} label="Email">
            {email || 'No email yet'}
          </SummaryRow>
          <SummaryRow icon={Building2} label="Department">
            {departmentLabel ?? 'Not selected'}
          </SummaryRow>
          <SummaryRow icon={Briefcase} label="Position">
            {positionLabel ?? 'Not selected'}
          </SummaryRow>
          <SummaryRow icon={Users} label="Manager">
            {managerLabel ?? 'Not selected'}
          </SummaryRow>
          <SummaryRow icon={Calendar} label="Hire Date">
            {hireDateLabel ?? 'Not selected'}
          </SummaryRow>
          <SummaryRow icon={ShieldCheck} label="Status">
            <Badge
              className={
                (isActive ?? true)
                  ? 'rounded-sm bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                  : 'rounded-sm'
              }
              variant={(isActive ?? true) ? undefined : 'secondary'}
            >
              <span
                className={
                  (isActive ?? true)
                    ? 'size-1.5 shrink-0 rounded-full bg-green-500'
                    : 'bg-muted-foreground size-1.5 shrink-0 rounded-full'
                }
              />
              {(isActive ?? true) ? 'Active' : 'Inactive'}
            </Badge>
          </SummaryRow>
        </div>
      </CardContent>
    </Card>
  );
}
