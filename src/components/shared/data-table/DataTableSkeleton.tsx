import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type DataTableSkeletonProps = {
  columns: number;
  rows?: number;
  className?: string;
};

export function DataTableSkeleton({ columns, rows = 8, className }: DataTableSkeletonProps) {
  return (
    <Table className={cn(className, 'min-w-200')}>
      <TableHeader>
        <TableRow className="bg-primary hover:bg-primary">
          {Array.from({ length: columns }).map((_, index) => (
            <TableHead key={index} className="h-11 px-4">
              <Skeleton className="h-3 w-20 bg-white/20" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex} className="hover:bg-transparent even:bg-muted-foreground/5">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex} className="px-4 py-3">
                <Skeleton className="h-4 w-full max-w-40" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
