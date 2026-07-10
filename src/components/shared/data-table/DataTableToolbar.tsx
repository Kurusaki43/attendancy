'use client';

import ClearFiltersButton from './ClearFilterButton';
import FilterTabs from './FilterTabs';
import SearchInput from './SearchInput';
import SortInput from './SortInput';

const DataTableToolbar = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <SearchInput placeholder="Search by name" />
      <div className="flex flex-wrap items-center gap-4">
        <FilterTabs
          queryKey="isActive"
          options={[
            { label: 'Active', value: 'true' },
            { label: 'Inactive', value: 'false' },
          ]}
        />
        <SortInput
          queryKey="sort"
          defaultValue="-createdAt"
          options={[
            { label: 'Newest First', value: '-createdAt' },
            { label: 'Oldest First', value: 'createdAt' },
            { label: 'Name (A-Z)', value: 'name' },
            { label: 'Name (Z-A)', value: '-name' },
            { label: 'Recently Updated', value: '-updatedAt' },
          ]}
        />
        <ClearFiltersButton />
      </div>
    </div>
  );
};

export default DataTableToolbar;
