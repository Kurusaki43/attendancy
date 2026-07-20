import type { LucideIcon } from 'lucide-react';
import { Briefcase, Building2, Calendar, Mail, ShieldCheck, User, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAvatar } from '@/features/dashboard/components/UserAvatar';
import {
  EMPLOYMENT_STATUS_BADGE_CLASSES,
  EMPLOYMENT_STATUS_DOT_CLASSES,
  EMPLOYMENT_STATUS_LABELS,
  type EmploymentStatus,
} from '@/features/employees/lib/employment-status';
import { cn } from '@/lib/utils';

type EmployeeSummaryCardProps = {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null | undefined;
  departmentLabel: string | undefined;
  positionLabel: string | undefined;
  managerLabel: string | undefined;
  hireDateLabel: string | undefined;
  employmentStatus: EmploymentStatus | undefined;
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
      <span className="font-medium">{children}</span>
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
  employmentStatus,
}: EmployeeSummaryCardProps) {
  const fullName = `${firstName} ${lastName}`.trim();
  const status = employmentStatus ?? 'ACTIVE';

  return (
    <Card>
      <CardHeader className="flex items-start justify-between gap-3 space-y-0">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary hidden size-10 shrink-0 items-center justify-center rounded-md sm:flex">
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
            {fullName || '-'}
          </SummaryRow>
          <SummaryRow icon={Mail} label="Email">
            {email || '-'}
          </SummaryRow>
          <SummaryRow icon={Building2} label="Department">
            {departmentLabel ?? '-'}
          </SummaryRow>
          <SummaryRow icon={Briefcase} label="Position">
            {positionLabel ?? '-'}
          </SummaryRow>
          <SummaryRow icon={Users} label="Manager">
            {managerLabel ?? '-'}
          </SummaryRow>
          <SummaryRow icon={Calendar} label="Hire Date">
            {hireDateLabel ?? '-'}
          </SummaryRow>
          <SummaryRow icon={ShieldCheck} label="Status">
            <Badge className={cn('rounded-sm', EMPLOYMENT_STATUS_BADGE_CLASSES[status])}>
              <span
                className={cn(
                  'size-1.5 shrink-0 rounded-full',
                  EMPLOYMENT_STATUS_DOT_CLASSES[status],
                )}
              />
              {EMPLOYMENT_STATUS_LABELS[status]}
            </Badge>
          </SummaryRow>
        </div>
      </CardContent>
    </Card>
  );
}
