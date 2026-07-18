'use client';

import { Building2, PencilIcon, SearchX, Trash } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import ClearFiltersButton from '@/components/shared/data-table/ClearFilterButton';
import { type ColumnDef, DataTable } from '@/components/shared/data-table/DataTable';
import { TableRowActions } from '@/components/shared/data-table/TableRowActions';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/features/dashboard/components/UserAvatar';
import { DEPARTMENT_ICON_MAP } from '@/features/departments/lib/department-visuals';
import {
  EMPLOYMENT_STATUS_BADGE_CLASSES,
  EMPLOYMENT_STATUS_DOT_CLASSES,
  EMPLOYMENT_STATUS_LABELS,
  type EmploymentStatus,
} from '@/features/employees/lib/employment-status';
import { cn } from '@/lib/utils';
import type { EmployeeResult } from '@/server/employees/types/action-results';

import { DeleteEmployeeDialog } from './DeleteEmployeeDialog';

function DepartmentCell({ department }: { department: EmployeeResult['department'] }) {
  if (!department) {
    return <span className="text-muted-foreground italic opacity-50">None</span>;
  }

  const Icon = (department.icon && DEPARTMENT_ICON_MAP.get(department.icon)) || Building2;

  return (
    <Badge variant="outline" className="gap-1.5 font-normal">
      <span
        className={cn(
          'flex size-3.5 shrink-0 items-center justify-center rounded-sm text-white',
          department.color || 'bg-muted-foreground',
        )}
      >
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Icon className="size-2.5" />
      </span>
      {department.name}
    </Badge>
  );
}

function StatusBadge({ status }: { status: EmploymentStatus }) {
  return (
    <Badge className={cn('rounded-sm', EMPLOYMENT_STATUS_BADGE_CLASSES[status])}>
      <span
        className={cn('size-1.5 shrink-0 rounded-full', EMPLOYMENT_STATUS_DOT_CLASSES[status])}
      />
      {EMPLOYMENT_STATUS_LABELS[status]}
    </Badge>
  );
}

function RowActions({ employee }: { employee: EmployeeResult }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const employeeName = `${employee.user.firstName} ${employee.user.lastName}`;

  return (
    <>
      <TableRowActions label={`Actions for ${employeeName}`}>
        <DropdownMenuItem
          className="cursor-pointer"
          render={<Link href={`/dashboard/employees/${employee.id}/edit`} />}
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

      <DeleteEmployeeDialog employee={employee} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}

const columns: ColumnDef<EmployeeResult>[] = [
  {
    key: 'name',
    header: 'Employee',
    cell: (row) => (
      <div className="flex items-center gap-3">
        <UserAvatar
          firstName={row.user.firstName}
          lastName={row.user.lastName}
          avatar={row.user.avatar}
        />
        <div>
          <span className="text-foreground block font-medium">
            {row.user.firstName} {row.user.lastName}
          </span>
          <span className="text-muted-foreground text-xs">{row.user.email}</span>
        </div>
      </div>
    ),
  },
  {
    key: 'employeeCode',
    header: 'Code',
    cell: (row) => <span className="text-xs font-medium">{row.employeeCode}</span>,
  },
  {
    key: 'department',
    header: 'Department',
    cell: (row) => <DepartmentCell department={row.department} />,
  },
  {
    key: 'position',
    header: 'Position',
    cell: (row) => (
      <span>{row.position?.title ?? <span className="italic opacity-50">None</span>}</span>
    ),
  },
  {
    key: 'manager',
    header: 'Manager',
    cell: (row) => (
      <span className="text-muted-foreground">
        {row.manager ? (
          `${row.manager.user.firstName} ${row.manager.user.lastName}`
        ) : (
          <span className="italic opacity-50">None</span>
        )}
      </span>
    ),
  },
  {
    key: 'hireDate',
    header: 'Hired',
    cell: (row) => (
      <span className="text-muted-foreground block text-center tabular-nums">
        {new Date(row.hireDate).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </span>
    ),
    headerClassName: 'text-center',
  },
  {
    key: 'status',
    header: 'Employment status',
    cell: (row) => <StatusBadge status={row.employmentStatus} />,
  },
  {
    key: 'actions',
    header: 'Actions',
    cell: (row) => <RowActions employee={row} />,
    headerClassName: 'text-center',
    cellClassName: 'text-center',
  },
];

type EmployeesTableProps = {
  employees: EmployeeResult[];
};

export function EmployeesTable({ employees }: EmployeesTableProps) {
  return (
    <DataTable
      data={employees}
      columns={columns}
      emptyMessage="No matching employees"
      emptyDescription="Try adjusting your search or filters."
      emptyIcon={SearchX}
      emptyAction={<ClearFiltersButton />}
      getRowKey={(row) => row.id}
    />
  );
}
