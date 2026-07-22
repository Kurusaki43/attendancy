'use client';

import { type LucideIcon, SearchX } from 'lucide-react';

import ClearFiltersButton from '@/components/shared/data-table/ClearFilterButton';
import { DataTable } from '@/components/shared/data-table/DataTable';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import type { EmployeeResult } from '@/server/employees/types/action-results';

import { buildEmployeeColumns } from './employee-columns';

type EmployeesTableProps = {
  employees: EmployeeResult[];
  showDepartment?: boolean;
  showPosition?: boolean;
  showManager?: boolean;
  showHireDate?: boolean;
  showEmploymentStatus?: boolean;
  showAccountStatus?: boolean;
  showActions?: boolean;
  renderRowActions?: (employee: EmployeeResult) => React.ReactNode;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  emptyAction?: React.ReactNode;
};

export function EmployeesTable({
  employees,
  showDepartment,
  showPosition,
  showManager,
  showHireDate,
  showEmploymentStatus,
  showAccountStatus,
  showActions,
  renderRowActions,
  emptyMessage = 'No matching employees',
  emptyDescription = 'Try adjusting your search or filters.',
  emptyIcon = SearchX,
  emptyAction = <ClearFiltersButton />,
}: EmployeesTableProps) {
  const userLocale = useUserLocale();

  return (
    <DataTable
      data={employees}
      columns={buildEmployeeColumns({
        userLocale,
        showDepartment,
        showPosition,
        showManager,
        showHireDate,
        showEmploymentStatus,
        showAccountStatus,
        showActions,
        renderRowActions,
      })}
      emptyMessage={emptyMessage}
      emptyDescription={emptyDescription}
      emptyIcon={emptyIcon}
      emptyAction={emptyAction}
      getRowKey={(row) => row.id}
    />
  );
}
