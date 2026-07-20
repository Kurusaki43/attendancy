'use client';

import ClearFiltersButton from './ClearFilterButton';
import DateRangeFilter from './DateRangeFilter';
import FilterSelect from './FilterSelect';
import SearchInput from './SearchInput';
import SortInput, { type SortOption } from './SortInput';

type FilterSelectConfig = {
  queryKey: string;
  label: string;
  options: { label: string; value: string }[];
};

type DateRangeFilterConfig = {
  fromQueryKey?: string;
  toQueryKey?: string;
  label?: string;
};

type DataTableToolbarProps = {
  searchPlaceholder?: string;
  sortOptions: SortOption[];
  /** The sort value applied when no `sort` param is present. Defaults to `sortOptions[0]`. */
  sortDefaultValue?: string;
  filters?: FilterSelectConfig[];
  statusFilter?: FilterSelectConfig;
  dateRange?: DateRangeFilterConfig;
};

const DataTableToolbar = ({
  searchPlaceholder = 'Search by name',
  sortOptions,
  sortDefaultValue,
  filters = [],
  statusFilter,
  dateRange,
}: DataTableToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6">
      <SearchInput placeholder={searchPlaceholder} />
      <div className="flex flex-wrap items-center gap-4">
        {statusFilter && (
          <FilterSelect
            queryKey={statusFilter.queryKey}
            label={statusFilter.label}
            options={statusFilter.options}
          />
        )}
        {filters.map((filter) => (
          <FilterSelect
            key={filter.queryKey}
            queryKey={filter.queryKey}
            label={filter.label}
            options={filter.options}
          />
        ))}
        {dateRange && <DateRangeFilter {...dateRange} />}
        <SortInput queryKey="sort" defaultValue={sortDefaultValue} options={sortOptions} />
        <ClearFiltersButton />
      </div>
    </div>
  );
};

export default DataTableToolbar;
