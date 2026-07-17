'use client';

import { SearchX } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import ClearFiltersButton from '@/components/shared/data-table/ClearFilterButton';
import { type ColumnDef, DataTable } from '@/components/shared/data-table/DataTable';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { updatePositionAction } from '@/server/positions/actions/update-position.action';
import type { PositionResult } from '@/server/positions/types/action-results';

import { DeletePositionDialog } from './DeletePositionDialog';
import { EditPositionDialog } from './EditPositionDialog';

function StatusSwitch({ id, title, isActive }: { id: string; title: string; isActive: boolean }) {
  const [checked, setChecked] = useState(isActive);
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = () => {
    const nextValue = !checked;

    // Optimistic update
    setChecked(nextValue);

    startTransition(async () => {
      const result = await updatePositionAction(id, {
        isActive: nextValue,
      });

      if (!result.success) {
        setChecked(!nextValue);

        toast.error(`Failed to ${nextValue ? 'activate' : 'deactivate'} ${title} position`);

        return;
      }

      toast.success(`${title} Position ${nextValue ? 'activated' : 'deactivated'} successfully`);
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

const columns: ColumnDef<PositionResult>[] = [
  {
    key: 'title',
    header: 'Position',
    cell: (row) => <span className="text-foreground font-medium">{row.title}</span>,
  },
  {
    key: 'code',
    header: 'Code',
    cell: (row) => <span className="text-muted-foreground font-mono text-xs">{row.code}</span>,
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
    cell: (row) => <StatusSwitch id={row.id} title={row.title} isActive={row.isActive} />,
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
        <EditPositionDialog position={row} />
        <DeletePositionDialog position={row} />
      </div>
    ),
    cellClassName: 'text-right',
  },
];

type PositionsTableProps = {
  positions: PositionResult[];
};

export function PositionsTable({ positions }: PositionsTableProps) {
  return (
    <DataTable
      data={positions}
      columns={columns}
      emptyMessage="No matching positions"
      emptyDescription="Try adjusting your search or filters."
      emptyIcon={SearchX}
      emptyAction={<ClearFiltersButton />}
      getRowKey={(row) => row.id}
    />
  );
}
