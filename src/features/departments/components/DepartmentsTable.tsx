'use client';

import { Building2, SearchX } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import ClearFiltersButton from '@/components/shared/data-table/ClearFilterButton';
import { type ColumnDef, DataTable } from '@/components/shared/data-table/DataTable';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { updateDepartmentAction } from '@/server/departments/actions/update-department.action';
import type { DepartmentResult } from '@/server/departments/types/action-results';

import { DEPARTMENT_ICON_MAP } from '../lib/department-visuals';
import { DeleteDepartmentDialog } from './DeleteDepartmentDialog';
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
      <Switch
        checked={checked}
        onCheckedChange={handleToggleStatus}
        disabled={isPending}
        className="select-none"
      />

      {isPending && <Spinner />}
    </div>
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
      <div className="min-w-0">
        <p className="text-foreground truncate font-medium">{row.name}</p>
        <p className="text-muted-foreground font-mono text-xs">{row.code}</p>
      </div>
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
      className="border"
    />
  );
}
