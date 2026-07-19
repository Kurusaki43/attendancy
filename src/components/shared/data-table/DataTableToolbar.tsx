'use client';

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
  statusFilter?: FilterSelectConfig;
};

const DataTableToolbar = ({
  searchPlaceholder = 'Search by name',
  sortOptions = DEFAULT_SORT_OPTIONS,
  filters = [],
  statusFilter = DEFAULT_STATUS_FILTER,
}: DataTableToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <SearchInput placeholder={searchPlaceholder} />
      <div className="flex flex-wrap items-center gap-4">
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
    </div>
  );
};

export default DataTableToolbar;
