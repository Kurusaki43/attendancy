'use client';

import { Building2, PencilIcon, SearchX, Trash, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import ClearFiltersButton from '@/components/shared/data-table/ClearFilterButton';
import { type ColumnDef, DataTable } from '@/components/shared/data-table/DataTable';
import { TableRowActions } from '@/components/shared/data-table/TableRowActions';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import { cn } from '@/lib/utils';
import type { DepartmentResult } from '@/server/departments/types/action-results';
import { DATE_FORMAT, formatDate } from '@/shared/utils/format-date';

import { DEPARTMENT_ICON_MAP } from '../lib/department-visuals';
import { DeleteDepartmentDialog } from './DeleteDepartmentDialog';

function StatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <Badge className="rounded-sm bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-400">
      <span className="size-1.5 shrink-0 rounded-full bg-green-500" />
      Active
    </Badge>
  ) : (
    <Badge variant="secondary" className="rounded-sm">
      <span className="bg-muted-foreground size-1.5 shrink-0 rounded-full" />
      Inactive
    </Badge>
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

function RowActions({ department }: { department: DepartmentResult }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <TableRowActions label={`Actions for ${department.name}`}>
        <DropdownMenuItem
          className="cursor-pointer"
          render={<Link href={`/dashboard/departments/${department.code}/edit`} />}
        >
          <PencilIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash />
          Delete
        </DropdownMenuItem>
      </TableRowActions>

      <DeleteDepartmentDialog
        department={department}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}

type UserLocale = { locale?: string; timezone?: string };

function buildColumns(userLocale: UserLocale): ColumnDef<DepartmentResult>[] {
  return [
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
      cell: (row) => <span className="font-mono text-xs">{row.code}</span>,
    },
    {
      key: 'employeeCount',
      header: 'Employees',
      cell: (row) => (
        <span className="text-muted-foreground flex items-center justify-center gap-1.5 text-center">
          <Users className="size-3.5" />
          {row.totalEmployeeCount ?? row.employeeCount ?? 0}
        </span>
      ),
      headerClassName: 'text-center',
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
        <span className="text-muted-foreground block text-center tabular-nums">
          {formatDate(row.createdAt, { ...userLocale, ...DATE_FORMAT })}
        </span>
      ),
      headerClassName: 'text-center',
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => <RowActions department={row} />,
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    },
  ];
}

type DepartmentsTableProps = {
  departments: DepartmentResult[];
};

export function DepartmentsTable({ departments }: DepartmentsTableProps) {
  const userLocale = useUserLocale();

  return (
    <DataTable
      data={departments}
      columns={buildColumns(userLocale)}
      emptyMessage="No matching departments"
      emptyDescription="Try adjusting your search or filters."
      emptyIcon={SearchX}
      emptyAction={<ClearFiltersButton />}
      getRowKey={(row) => row.id}
    />
  );
}
