'use client';

import ClearFiltersButton from './ClearFilterButton';
import FilterSelect from './FilterSelect';
import SearchInput from './SearchInput';
import SortInput from './SortInput';

const DataTableToolbar = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <SearchInput placeholder="Search by name" />
      <div className="ml-auto flex flex-wrap items-center gap-4">
        <FilterSelect
          queryKey="status"
          label="status"
          options={[
            { label: 'Active', value: 'active' },
            { label: 'NOT-Active', value: 'not-active' },
          ]}
        />
        <SortInput
          queryKey="sort"
          options={[
            { label: 'Newest First', value: 'createdAt-desc' },
            { label: 'Oldest First', value: 'createdAt-asc' },
            { label: 'Name (A-Z)', value: 'name-asc' },
            { label: 'Name (Z-A)', value: 'name-desc' },
            { label: 'Recently Updated', value: 'updatedAt-desc' },
          ]}
        />
        <ClearFiltersButton />
      </div>
    </div>
  );
};

export default DataTableToolbar;
