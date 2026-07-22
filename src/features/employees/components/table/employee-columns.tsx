import type { ColumnDef } from '@/components/shared/data-table/DataTable';
import type { EmployeeResult } from '@/server/employees/types/action-results';
import { DATE_FORMAT, formatDate } from '@/shared/utils/format-date';

import { AccountStatusBadge } from './cells/AccountStatusBadge';
import { DepartmentCell } from './cells/DepartmentCell';
import { EmployeeCell } from './cells/EmployeeCell';
import { EmploymentStatusBadge } from './cells/EmploymentStatusBadge';
import { ManagerCell } from './cells/ManagerCell';
import { PositionCell } from './cells/PositionCell';
import { EmployeeRowActions } from './EmployeeRowActions';

type UserLocale = { locale?: string; timezone?: string };

export type EmployeeColumnOptions = {
  userLocale: UserLocale;
  showDepartment?: boolean;
  showPosition?: boolean;
  showManager?: boolean;
  showHireDate?: boolean;
  showEmploymentStatus?: boolean;
  showAccountStatus?: boolean;
  showActions?: boolean;
  renderRowActions?: (employee: EmployeeResult) => React.ReactNode;
};

export function buildEmployeeColumns({
  userLocale,
  showDepartment = true,
  showPosition = true,
  showManager = true,
  showHireDate = true,
  showEmploymentStatus = true,
  showAccountStatus = true,
  showActions = true,
  renderRowActions = (employee) => <EmployeeRowActions employee={employee} />,
}: EmployeeColumnOptions): ColumnDef<EmployeeResult>[] {
  const columns: ColumnDef<EmployeeResult>[] = [
    {
      key: 'name',
      header: 'Employee',
      cell: (row) => <EmployeeCell employee={row} />,
    },
  ];

  if (showDepartment) {
    columns.push({
      key: 'department',
      header: 'Department',
      cell: (row) => <DepartmentCell department={row.department} />,
    });
  }

  if (showPosition) {
    columns.push({
      key: 'position',
      header: 'Position',
      cell: (row) => <PositionCell position={row.position} />,
    });
  }

  if (showManager) {
    columns.push({
      key: 'manager',
      header: 'Manager',
      cell: (row) => <ManagerCell manager={row.manager} />,
    });
  }

  if (showHireDate) {
    columns.push({
      key: 'hireDate',
      header: 'Hired',
      cell: (row) => (
        <span className="text-muted-foreground block text-center tabular-nums">
          {formatDate(row.hireDate, { ...userLocale, ...DATE_FORMAT })}
        </span>
      ),
      headerClassName: 'text-center',
    });
  }

  if (showEmploymentStatus) {
    columns.push({
      key: 'status',
      header: 'Employment',
      cell: (row) => <EmploymentStatusBadge status={row.employmentStatus} />,
    });
  }

  if (showAccountStatus) {
    columns.push({
      key: 'accountStatus',
      header: 'Account',
      cell: (row) => <AccountStatusBadge status={row.user.status} />,
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
