'use client';

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
  className?: string;
  getRowKey: (row: TData) => string;
};

export function DataTable<TData>({
  data,
  columns,
  emptyMessage = 'No data found.',
  className,
  getRowKey,
}: DataTableProps<TData>) {
  return (
    <div className={cn('overflow-hidden rounded-lg border shadow-sm', className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
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
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground h-32 text-center text-sm"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={getRowKey(row)} className="hover:bg-muted/30 transition-colors">
                {columns.map((col) => (
                  <TableCell key={col.key} className={cn('px-4 py-3.5 text-sm', col.cellClassName)}>
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
