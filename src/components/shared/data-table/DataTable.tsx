'use client';

import type { LucideIcon } from 'lucide-react';

import { EmptyState } from '@/components/shared/EmptyState';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type ColumnDef<TData> = {
  key: string;
  header: string;
  cell: (row: TData) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  emptyAction?: React.ReactNode;
  className?: string;
  getRowKey: (row: TData) => string;
};

export function DataTable<TData>({
  data,
  columns,
  emptyMessage = 'No data found',
  emptyDescription,
  emptyIcon,
  emptyAction,
  getRowKey,
  className,
}: DataTableProps<TData>) {
  return (
    <div className="border-border/60 overflow-hidden rounded-lg border">
      <Table className={cn(className, 'min-w-200')}>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40 border-border/60">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  'text-muted-foreground h-11 px-4 text-xs font-semibold tracking-wide uppercase',
                  col.headerClassName,
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                <EmptyState
                  icon={emptyIcon}
                  title={emptyMessage}
                  description={emptyDescription}
                  action={emptyAction}
                />
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={getRowKey(row)} className="hover:bg-muted/30 transition-colors">
                {columns.map((col) => (
                  <TableCell key={col.key} className={cn('px-4 py-2 text-sm', col.cellClassName)}>
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
