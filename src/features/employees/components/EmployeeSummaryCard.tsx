import type { LucideIcon } from 'lucide-react';
import { Briefcase, Building2, Calendar, Mail, ShieldCheck, User, Users } from 'lucide-react';
import { type Control, useWatch } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAvatar } from '@/features/dashboard/components/UserAvatar';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import type {
  CreateEmployeeFormValues,
  EmployeeFormOutput,
  EmployeeFormValues,
  SelectOption,
} from '@/features/employees/lib/employee-form';
import {
  EMPLOYMENT_STATUS_BADGE_CLASSES,
  EMPLOYMENT_STATUS_DOT_CLASSES,
  EMPLOYMENT_STATUS_LABELS,
} from '@/features/employees/lib/employment-status';
import { cn } from '@/lib/utils';
import type { EmployeeResult } from '@/server/employees/types/action-results';
import { DATE_FORMAT, formatDate } from '@/shared/utils/format-date';

type EmployeeSummaryCardProps = {
  control: Control<EmployeeFormValues, unknown, EmployeeFormOutput>;
  departments: SelectOption[];
  positions: SelectOption[];
  managerOptions: SelectOption[];
} & ({ mode: 'create'; employee?: never } | { mode: 'update'; employee: EmployeeResult });

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
  control,
  departments,
  positions,
  managerOptions,
  mode,
  employee,
}: EmployeeSummaryCardProps) {
  const isUpdateMode = mode === 'update';
  const userLocale = useUserLocale();

  const createControl = control as unknown as Control<CreateEmployeeFormValues>;
  const [watchedFirstName, watchedLastName, watchedEmail] = useWatch({
    control: createControl,
    name: ['firstName', 'lastName', 'email'],
  });

  const [departmentId, positionId, managerId, employmentStatus, hireDate, avatar] = useWatch({
    control,
    name: ['departmentId', 'positionId', 'managerId', 'employmentStatus', 'hireDate', 'avatar'],
  });

  const firstName = watchedFirstName ?? (isUpdateMode ? employee.user.firstName : '');
  const lastName = watchedLastName ?? (isUpdateMode ? employee.user.lastName : '');
  const email = watchedEmail ?? (isUpdateMode ? employee.user.email : '');

  const departmentLabel = departments.find((department) => department.id === departmentId)?.label;
  const positionLabel = positions.find((position) => position.id === positionId)?.label;
  const managerLabel = managerOptions.find((manager) => manager.id === managerId)?.label;
  const hireDateLabel = hireDate
    ? formatDate(hireDate as string | number | Date, { ...userLocale, ...DATE_FORMAT })
    : undefined;

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
