'use client';

import { Building2 } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import {
  DEPARTMENT_COLOR_OPTIONS,
  DEPARTMENT_ICON_MAP,
  DEPARTMENT_ICON_OPTIONS,
} from '@/features/departments/lib/department-visuals';
import { cn } from '@/lib/utils';
import type { GetDepartmentDetailActionResult } from '@/server/departments/types/action-results';
import { DATE_FORMAT, formatDate } from '@/shared/utils/format-date';

type DepartmentInfoCardProps = {
  department: GetDepartmentDetailActionResult;
};

function ParentBadge({ parent }: { parent: GetDepartmentDetailActionResult['parent'] }) {
  if (!parent) {
    return <span className="text-muted-foreground text-sm italic opacity-70">Top-level</span>;
  }

  const Icon = (parent.icon && DEPARTMENT_ICON_MAP.get(parent.icon)) || Building2;

  return (
    <Badge
      variant="outline"
      className="gap-1.5 font-normal"
      render={<Link href={`/dashboard/departments/${parent.code}`} />}
    >
      <span
        className={cn(
          'flex size-3.5 shrink-0 items-center justify-center rounded-sm text-white',
          parent.color || 'bg-muted-foreground',
        )}
      >
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Icon className="size-2.5" />
      </span>
      {parent.name}
    </Badge>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</p>
      <div className="text-foreground mt-1 text-sm">{children}</div>
    </div>
  );
}

export function DepartmentInfoCard({ department }: DepartmentInfoCardProps) {
  const userLocale = useUserLocale();

  const Icon = (department.icon && DEPARTMENT_ICON_MAP.get(department.icon)) || Building2;
  const iconLabel =
    DEPARTMENT_ICON_OPTIONS.find((option) => option.value === department.icon)?.label ?? 'General';
  const colorLabel =
    DEPARTMENT_COLOR_OPTIONS.find((option) => option.value === department.color)?.label ?? 'Slate';

  return (
    <Card className="bg-card border-border card-shadow flex-1">
      <CardContent className="flex flex-col gap-6 sm:flex-row">
        <span
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-xl text-white lg:size-20',
            department.color || 'bg-muted-foreground',
          )}
        >
          {/* eslint-disable-next-line react-hooks/static-components */}
          <Icon className="size-9" />
        </span>

        <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
          <Field label="Department Code">
            <span className="font-mono">{department.code}</span>
          </Field>

          <Field label="Department Icon">
            <span className="flex items-center gap-1.5">
              {/* eslint-disable-next-line react-hooks/static-components */}
              <Icon className="text-muted-foreground size-3.5" />
              {iconLabel}
            </span>
          </Field>
          <Field label="Created At">
            {formatDate(department.createdAt, { ...userLocale, ...DATE_FORMAT })}
          </Field>

          <Field label="Department Color">
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  'size-3 shrink-0 rounded-full',
                  department.color || 'bg-muted-foreground',
                )}
              />
              {colorLabel}
            </span>
          </Field>
          <Field label="Parent Department">
            <ParentBadge parent={department.parent} />
          </Field>
          <Field label="Description" className="max-w-sm lg:col-span-2">
            {department.description || (
              <span className="text-muted-foreground italic opacity-70">No description</span>
            )}
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}
