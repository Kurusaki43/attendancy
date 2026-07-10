'use client';

import ClearFiltersButton from './ClearFilterButton';
import FilterSelect from './FilterSelect';
import SearchInput from './SearchInput';
import SortInput from './SortInput';

const DataTableToolbar = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <SearchInput placeholder="Search by name" />
      <div className="flex flex-wrap items-center gap-4">
        <FilterSelect
          queryKey="isActive"
          label="isActive"
          options={[
            { label: 'Active', value: 'true' },
            { label: 'NOT-Active', value: 'false' },
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
