'use client';

import ClearFiltersButton from './ClearFilterButton';
import FilterSelect from './FilterSelect';
import FilterTabs from './FilterTabs';
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
  /** Query-string key the filter writes; must be in the page's query schema and the service's
   * filterable fields (e.g. EMPLOYEE_FILTERABLE_FIELDS) or the value is silently ignored. */
  queryKey: string;
  label: string;
  options: { label: string; value: string }[];
};

type DataTableToolbarProps = {
  /** Shown in the search input; should reflect the fields the current page's service actually
   * searches (see e.g. DEPARTMENT_SEARCHABLE_FIELDS/POSITION_SEARCHABLE_FIELDS). */
  searchPlaceholder?: string;
  /** Sort options; values must match the page's own query schema's `sort` enum — the default
   * (name-based) values only make sense for models that actually have a `name` field. */
  sortOptions?: SortOption[];
  /** Extra dropdown filters rendered between the status tabs and the sort input. */
  filters?: FilterSelectConfig[];
};

const DataTableToolbar = ({
  searchPlaceholder = 'Search by name',
  sortOptions = DEFAULT_SORT_OPTIONS,
  filters = [],
}: DataTableToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <SearchInput placeholder={searchPlaceholder} />
      <div className="flex flex-wrap items-center gap-4">
        <FilterTabs
          queryKey="isActive"
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
    </div>
  );
};

export default DataTableToolbar;
