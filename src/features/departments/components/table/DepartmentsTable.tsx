'use client';

import { type LucideIcon, SearchX } from 'lucide-react';

import ClearFiltersButton from '@/components/shared/data-table/ClearFilterButton';
import { DataTable } from '@/components/shared/data-table/DataTable';
import { useUserLocale } from '@/features/dashboard/lib/user-locale-context';
import type { DepartmentResult } from '@/server/departments/types/action-results';

import { buildDepartmentColumns } from './department-columns';

type DepartmentsTableProps = {
  departments: DepartmentResult[];
  showParent?: boolean;
  showCode?: boolean;
  showEmployeeCount?: boolean;
  showStatus?: boolean;
  showCreatedAt?: boolean;
  showActions?: boolean;
  renderRowActions?: (department: DepartmentResult) => React.ReactNode;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  emptyAction?: React.ReactNode;
};

export function DepartmentsTable({
  departments,
  showParent,
  showCode,
  showEmployeeCount,
  showStatus,
  showCreatedAt,
  showActions,
  renderRowActions,
  emptyMessage = 'No matching departments',
  emptyDescription = 'Try adjusting your search or filters.',
  emptyIcon = SearchX,
  emptyAction = <ClearFiltersButton />,
}: DepartmentsTableProps) {
  const userLocale = useUserLocale();

  return (
    <DataTable
      data={departments}
      columns={buildDepartmentColumns({
        userLocale,
        showParent,
        showCode,
        showEmployeeCount,
        showStatus,
        showCreatedAt,
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
