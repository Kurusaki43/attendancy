'use client';

import { Building2, PencilIcon, SearchX, Users } from 'lucide-react';
import Link from 'next/link';

import ClearFiltersButton from '@/components/shared/data-table/ClearFilterButton';
import { type ColumnDef, DataTable } from '@/components/shared/data-table/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DepartmentResult } from '@/server/departments/types/action-results';

import { DEPARTMENT_ICON_MAP } from '../lib/department-visuals';
import { DeleteDepartmentDialog } from './DeleteDepartmentDialog';

function StatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <Badge className="bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400">
      Active
    </Badge>
  ) : (
    <Badge variant="secondary">Inactive</Badge>
  );
}

function DepartmentCell({ row }: { row: DepartmentResult }) {
  const Icon = (row.icon && DEPARTMENT_ICON_MAP.get(row.icon)) || Building2;

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-md text-white',
          row.color || 'bg-muted text-muted-foreground',
        )}
      >
        {/* Icon is always one of a fixed set of module-level lucide-react components resolved
        by key from DEPARTMENT_ICON_MAP — never freshly created — so this is safe. */}
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Icon className="size-4" />
      </span>
      <p className="text-foreground truncate font-medium">{row.name}</p>
    </div>
  );
}

function ParentCell({ parent }: { parent: DepartmentResult['parent'] }) {
  if (!parent) {
    return <span className="text-muted-foreground text-xs italic">Top-level</span>;
  }

  const Icon = (parent.icon && DEPARTMENT_ICON_MAP.get(parent.icon)) || Building2;

  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
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

const columns: ColumnDef<DepartmentResult>[] = [
  {
    key: 'name',
    header: 'Department',
    cell: (row) => <DepartmentCell row={row} />,
  },
  {
    key: 'parent',
    header: 'Parent',
    cell: (row) => <ParentCell parent={row.parent} />,
  },
  {
    key: 'code',
    header: 'Code',
    cell: (row) => <span className="text-muted-foreground font-mono text-xs">{row.code}</span>,
  },
  {
    key: 'employeeCount',
    header: 'Employees',
    cell: (row) => (
      <span className="text-muted-foreground flex items-center gap-1.5">
        <Users className="size-3.5" />
        {row.employeeCount ?? 0}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => <StatusBadge isActive={row.isActive} />,
  },
  {
    key: 'createdAt',
    header: 'Created',
    cell: (row) => (
      <span className="text-muted-foreground tabular-nums">
        {new Date(row.createdAt).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </span>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    cell: (row) => (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href={`/dashboard/departments/${row.code}/edit`} />}
        >
          <PencilIcon />
          <span className="sr-only">Edit {row.name}</span>
        </Button>
        <DeleteDepartmentDialog department={row} />
      </div>
    ),
    cellClassName: 'text-right',
  },
];

type DepartmentsTableProps = {
  departments: DepartmentResult[];
};

export function DepartmentsTable({ departments }: DepartmentsTableProps) {
  return (
    <DataTable
      data={departments}
      columns={columns}
      emptyMessage="No matching departments"
      emptyDescription="Try adjusting your search or filters."
      emptyIcon={SearchX}
      emptyAction={<ClearFiltersButton />}
      getRowKey={(row) => row.id}
    />
  );
}
