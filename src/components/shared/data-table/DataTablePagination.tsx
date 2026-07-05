'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryParams } from '@/hooks/use-query-params';

type Props = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

const PAGE_SIZES = [10, 20, 50, 100];

export default function DataTablePagination({ page, limit, totalItems, totalPages }: Props) {
  const { setParam } = useQueryParams();

  const start = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalItems);

  function goto(p: number) {
    setParam('page', p, {
      resetPage: false,
    });
  }

  function renderPages() {
    const pages: (number | '...')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push('...');
    }

    const from = Math.max(2, page - 1);
    const to = Math.min(totalPages - 1, page + 1);

    for (let i = from; i <= to; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  }

  return (
    <div className="flex flex-col gap-4 border-t pt-4 md:flex-row md:items-center md:justify-between">
      <div className="text-muted-foreground text-sm">
        Showing{' '}
        <span className="text-foreground font-medium">
          {start}-{end}
        </span>{' '}
        of <span className="text-foreground font-medium">{totalItems}</span>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">Rows per page</span>

          <Select value={String(limit)} onValueChange={(value) => setParam('limit', value)}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button size="icon" variant="outline" disabled={page === 1} onClick={() => goto(1)}>
            <ChevronsLeft className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            disabled={page === 1}
            onClick={() => goto(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>

          {renderPages().map((item, index) =>
            item === '...' ? (
              <span key={index} className="text-muted-foreground w-8 text-center">
                …
              </span>
            ) : (
              <Button
                key={item}
                size="icon"
                variant={item === page ? 'default' : 'outline'}
                onClick={() => goto(item)}
              >
                {item}
              </Button>
            ),
          )}

          <Button
            size="icon"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => goto(page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => goto(totalPages)}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
