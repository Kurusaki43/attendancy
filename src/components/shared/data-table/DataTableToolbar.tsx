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

const DEFAULT_STATUS_FILTER: FilterSelectConfig = {
  queryKey: 'isActive',
  label: 'Status',
  options: [
    { label: 'Active', value: 'true' },
    { label: 'Inactive', value: 'false' },
  ],
};

type DataTableToolbarProps = {
  searchPlaceholder?: string;
  sortOptions?: SortOption[];
  filters?: FilterSelectConfig[];
  /** Overrides the built-in Active/Inactive filter — e.g. a model with more than two statuses. */
  statusFilter?: FilterSelectConfig;
};

const DataTableToolbar = ({
  searchPlaceholder = 'Search by name',
  sortOptions = DEFAULT_SORT_OPTIONS,
  filters = [],
  statusFilter = DEFAULT_STATUS_FILTER,
}: DataTableToolbarProps) => {
  return (
    <Card size="sm" className="border-border rounded-sm border border-dashed shadow-none ring-0">
      <CardContent className="flex flex-wrap items-center justify-between gap-6">
        <SearchInput placeholder={searchPlaceholder} />
        <div className="flex flex-wrap items-center gap-6">
          <FilterSelect
            queryKey={statusFilter.queryKey}
            label={statusFilter.label}
            defaultLabel="All Statuses"
            options={statusFilter.options}
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
