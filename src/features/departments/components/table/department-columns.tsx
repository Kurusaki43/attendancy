import { Users } from 'lucide-react';

import type { ColumnDef } from '@/components/shared/data-table/DataTable';
import type { DepartmentResult } from '@/server/departments/types/action-results';
import { DATE_FORMAT, formatDate } from '@/shared/utils/format-date';

import { DepartmentCell } from './cells/DepartmentCell';
import { DepartmentStatusBadge } from './cells/DepartmentStatusBadge';
import { ParentCell } from './cells/ParentCell';
import { DepartmentRowActions } from './DepartmentRowActions';

type UserLocale = { locale?: string; timezone?: string };

export type DepartmentColumnOptions = {
  userLocale: UserLocale;
  showParent?: boolean;
  showCode?: boolean;
  showEmployeeCount?: boolean;
  showStatus?: boolean;
  showCreatedAt?: boolean;
  showActions?: boolean;
  renderRowActions?: (department: DepartmentResult) => React.ReactNode;
};

export function buildDepartmentColumns({
  userLocale,
  showParent = true,
  showCode = true,
  showEmployeeCount = true,
  showStatus = true,
  showCreatedAt = true,
  showActions = true,
  renderRowActions = (department) => <DepartmentRowActions department={department} />,
}: DepartmentColumnOptions): ColumnDef<DepartmentResult>[] {
  const columns: ColumnDef<DepartmentResult>[] = [
    {
      key: 'name',
      header: 'Department',
      cell: (row) => <DepartmentCell department={row} />,
    },
  ];

  if (showParent) {
    columns.push({
      key: 'parent',
      header: 'Parent',
      cell: (row) => <ParentCell parent={row.parent} />,
    });
  }

  if (showCode) {
    columns.push({
      key: 'code',
      header: 'Code',
      cell: (row) => <span className="font-mono text-xs">{row.code}</span>,
    });
  }

  if (showEmployeeCount) {
    columns.push({
      key: 'employeeCount',
      header: 'Employees',
      cell: (row) => (
        <span className="text-muted-foreground flex items-center justify-center gap-1.5 text-center">
          <Users className="size-3.5" />
          {row.totalEmployeeCount ?? row.employeeCount ?? 0}
        </span>
      ),
      headerClassName: 'text-center',
    });
  }

  if (showStatus) {
    columns.push({
      key: 'status',
      header: 'Status',
      cell: (row) => <DepartmentStatusBadge isActive={row.isActive} />,
    });
  }

  if (showCreatedAt) {
    columns.push({
      key: 'createdAt',
      header: 'Created',
      cell: (row) => (
        <span className="text-muted-foreground block text-center tabular-nums">
          {formatDate(row.createdAt, { ...userLocale, ...DATE_FORMAT })}
        </span>
      ),
      headerClassName: 'text-center',
    });
  }

  if (showActions) {
    columns.push({
      key: 'actions',
      header: 'Actions',
      cell: (row) => renderRowActions(row),
      headerClassName: 'text-center',
      cellClassName: 'text-center',
    });
  }

  return columns;
}
