'use client';

import { Card, CardContent } from '@/components/ui/card';

import ClearFiltersButton from './ClearFilterButton';
import FilterSelect from './FilterSelect';
import SearchInput from './SearchInput';
import SortInput, { type SortOption } from './SortInput';

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { label: 'Newest First', value: '-createdAt' },
  { label: 'Oldest First', value: 'createdAt' },
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Name (Z-A)', value: '-name' },
  { label: 'Recently Updated', value: '-updatedAt' },
];

type FilterSelectConfig = {
  queryKey: string;
  label: string;
  options: { label: string; value: string }[];
};

type DataTableToolbarProps = {
  searchPlaceholder?: string;
  sortOptions?: SortOption[];
  filters?: FilterSelectConfig[];
};

const DataTableToolbar = ({
  searchPlaceholder = 'Search by name',
  sortOptions = DEFAULT_SORT_OPTIONS,
  filters = [],
}: DataTableToolbarProps) => {
  return (
    <Card size="sm" className="border-border border border-dashed shadow-none ring-0">
      <CardContent className="flex flex-wrap items-center justify-between gap-6">
        <SearchInput placeholder={searchPlaceholder} />
        <div className="flex flex-wrap items-center gap-6">
          <FilterSelect
            queryKey="isActive"
            label="Status"
            defaultLabel="All Statuses"
            options={[
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
          />
          {filters.map((filter) => (
            <FilterSelect
              key={filter.queryKey}
              queryKey={filter.queryKey}
              label={filter.label}
              options={filter.options}
            />
          ))}
          <SortInput queryKey="sort" defaultValue="-createdAt" options={sortOptions} />
          <ClearFiltersButton />
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTableToolbar;
