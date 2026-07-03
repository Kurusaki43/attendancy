'use client';

import { type ColumnDef, DataTable } from '@/components/ui/DataTable';
import type { DepartmentResult } from '@/features/departments/types/action-results';
import { cn } from '@/lib/utils';

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        isActive
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
          : 'border-border bg-muted text-muted-foreground',
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          isActive ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-muted-foreground/50',
        )}
      />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}

const columns: ColumnDef<DepartmentResult>[] = [
  {
    key: 'name',
    header: 'Department',
    cell: (row) => <span className="text-foreground font-medium">{row.name}</span>,
  },
  {
    key: 'description',
    header: 'Description',
    cell: (row) => (
      <span className="text-muted-foreground max-w-sm truncate">
        {row.description ?? <span className="italic opacity-50">No description</span>}
      </span>
    ),
    cellClassName: 'max-w-sm',
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
];

type DepartmentsTableProps = {
  departments: DepartmentResult[];
};

export function DepartmentsTable({ departments }: DepartmentsTableProps) {
  return (
    <DataTable
      data={departments}
      columns={columns}
      emptyMessage="No departments found."
      getRowKey={(row) => row.id}
    />
  );
}
