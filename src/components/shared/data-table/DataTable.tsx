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
  getRowKey,
  className,
}: DataTableProps<TData>) {
  return (
    <Table className={cn(className, 'min-w-200')}>
      <TableHeader>
        <TableRow className="bg-primary hover:bg-primary">
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className={cn(
                'h-11 px-4 text-xs font-semibold tracking-wide text-white uppercase',
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
          <TableRow className="odd:bg-accent-foreground hover:bg-transparent">
            <TableCell
              colSpan={columns.length}
              className="text-muted-foreground h-32 text-center text-sm"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row) => (
            <TableRow
              key={getRowKey(row)}
              className="hover:bg-muted/30 even:bg-muted-foreground/5 transition-colors"
            >
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
  );
}
