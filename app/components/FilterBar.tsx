'use client';
import { TrashIcon } from '@heroicons/react/24/outline'; 
import React from 'react';
import Select from 'react-select';
import DiscreteSliderLabel from './PopSlider'; 
const districtOptions = [
  { value: 'district1', label: 'District 1' },
  { value: 'district2', label: 'District 2' },
];

const cityOptions = [
  { value: 'atlanta', label: 'Atlanta' },
  { value: 'savannah', label: 'Savannah' },
  { value: 'waycross', label: 'Waycross' },
];

const activityTypeOptions = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'visit', label: 'Visit' },
  { value: 'text', label: 'Text' },
  { value: 'district meeting', label: 'District Meeting' },
  { value: 'call', label: 'CALL' },
];

const dateOptions = [
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last90days', label: 'Last 90 Days' },
  { value: 'last6months', label: 'Last 6 Months' }, 
  { value: 'last12months', label: 'Last 12 Months' },
  { value: 'Custom', label: 'All Custom' },
];




interface FilterBarProps {
  showActivityType?: boolean;
  cityFilter: string;
  setCityFilter: (city: string) => void;
  activityTypeFilter: string;
  setActivityTypeFilter: (type: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  showActivityType = true,
  cityFilter,
  setCityFilter,
  activityTypeFilter,
  setActivityTypeFilter,
}) => {
  const handleReset = () => {
    setCityFilter('');
    setActivityTypeFilter('');
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
      <div className="border rounded flex-1 min-w-[140px] max-w-xs">
        <Select options={dateOptions} placeholder="Date" />
      </div>
    
      
      {showActivityType && (
  <div className="border rounded flex-1 min-w-[140px] max-w-xs">
    <Select
      instanceId="activity-type-select"
      options={activityTypeOptions}
      placeholder="Activity Type"
      value={
        activityTypeOptions.find(
          opt => opt.value.toLowerCase() === activityTypeFilter.toLowerCase()
        ) || null
      }
      onChange={selected => setActivityTypeFilter(selected ? selected.value : '')}
      isClearable
    />
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