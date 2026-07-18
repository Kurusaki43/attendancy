'use client';

import { PencilIcon, SearchX, Trash } from 'lucide-react';
import { useState } from 'react';

import ClearFiltersButton from '@/components/shared/data-table/ClearFilterButton';
import { type ColumnDef, DataTable } from '@/components/shared/data-table/DataTable';
import { TableRowActions } from '@/components/shared/data-table/TableRowActions';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import type { PositionResult } from '@/server/positions/types/action-results';

import { DeletePositionDialog } from './DeletePositionDialog';
import { EditPositionDialog } from './EditPositionDialog';

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

function RowActions({ position }: { position: PositionResult }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <TableRowActions label={`Actions for ${position.title}`}>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setEditOpen(true)}>
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

      <EditPositionDialog position={position} open={editOpen} onOpenChange={setEditOpen} />
      <DeletePositionDialog position={position} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
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
  {
    key: 'actions',
    header: 'Actions',
    cell: (row) => <RowActions position={row} />,
    headerClassName: 'text-center',
    cellClassName: 'text-center',
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
