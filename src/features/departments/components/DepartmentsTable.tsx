'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { type ColumnDef, DataTable } from '@/components/ui/DataTable';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import type { DepartmentResult } from '@/features/departments/types/action-results';

import { updateDepartmentAction } from '../actions/update-department.action';
import DeleteDepartementDialog from './DeleteDepartementDialog';
import { EditDepartmentDialog } from './EditDepartmentDialog';

function StatusSwitch({ id, name, isActive }: { id: string; name: string; isActive: boolean }) {
  const [checked, setChecked] = useState(isActive);
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = () => {
    const nextValue = !checked;

    // Optimistic update
    setChecked(nextValue);

    startTransition(async () => {
      const result = await updateDepartmentAction(id, {
        isActive: nextValue,
      });

      if (!result.success) {
        setChecked(!nextValue);

        toast.error(`Failed to ${nextValue ? 'activate' : 'deactivate'} ${name} department`);

        return;
      }

      toast.success(`${name} Department ${nextValue ? 'activated' : 'deactivated'} successfully`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={handleToggleStatus} disabled={isPending} />

      {isPending && <Spinner />}
    </div>
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
      <p className="text-muted-foreground max-w-sm truncate">
        {row.description ?? <span className="italic opacity-50">No description</span>}
      </p>
    ),
    cellClassName: 'max-w-sm',
  },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => <StatusSwitch id={row.id} name={row.name} isActive={row.isActive} />,
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
        <EditDepartmentDialog department={row} />
        <DeleteDepartementDialog department={row} />
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
      emptyMessage="No departments found."
      getRowKey={(row) => row.id}
    />
  );
}
