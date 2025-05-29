'use client';
import { TrashIcon } from '@heroicons/react/24/outline'; 
import React from 'react';
import Select from 'react-select';

const districtOptions = [
  { value: 'district1', label: 'District 1' },
  { value: 'district2', label: 'District 2' },
];

const cityOptions = [
  { value: 'atlanta', label: 'Atlanta' },
  { value: 'savannah', label: 'Savannah' },
];

const activityTypeOptions = [
  { value: 'training', label: 'Training' },
  { value: 'event', label: 'Event' },
];

interface FilterBarProps {
  showActivityType?: boolean;
  cityFilter: string;
  setCityFilter: (city: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  showActivityType = true,
  cityFilter,
  setCityFilter,
}) => {
  const handleReset = () => {
    setCityFilter('');
    // Reset other filters here as needed
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 pb-0 items-center rounded-xl w-full">
      <div className="border rounded flex-1 min-w-[140px] max-w-xs">
        <Select instanceId="district-select" options={districtOptions} placeholder="District" />
      </div>
      <div className="border rounded flex-1 min-w-[140px] max-w-xs">
        <Select
          instanceId="city-select"
          options={cityOptions}
          placeholder="City"
          value={cityOptions.find(opt => opt.value.toLowerCase() === cityFilter.toLowerCase()) || null}
          onChange={selected => setCityFilter(selected ? selected.value : '')}
          isClearable
        />
      </div>
      <input
        type="date"
        className="border rounded p-2 flex-1 min-w-[120px] max-w-xs"
        placeholder="Start Date"
      />
      <input
        type="date"
        className="border rounded p-2 flex-1 min-w-[120px] max-w-xs"
        placeholder="End Date"
      />
      {showActivityType && (
        <div className="border rounded flex-1 min-w-[140px] max-w-xs">
          <Select instanceId="activity-type-select" options={activityTypeOptions} placeholder="Activity Type" />
        </div>
      )}
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-semibold shadow min-w-[100px]">
        Filter
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="flex items-center justify-center bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition font-semibold shadow min-w-[44px]"
        title="Reset filters"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default FilterBar;