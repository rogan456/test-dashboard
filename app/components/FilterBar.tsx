'use client';
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
}

const FilterBar: React.FC<FilterBarProps> = ({ showActivityType = true }) => (
  <div className="flex flex-wrap gap-4 p-4 pb-0 items-cente rounded-xl w-full">
    <div className="flex-1 min-w-[140px] max-w-xs">
      <Select instanceId="district-select" options={districtOptions} placeholder="District" />
    </div>
    <div className="flex-1 min-w-[140px] max-w-xs">
      <Select instanceId="city-select" options={cityOptions} placeholder="City" />
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
      <div className="flex-1 min-w-[140px] max-w-xs">
        <Select instanceId="activity-type-select" options={activityTypeOptions} placeholder="Activity Type" />
      </div>
    )}
    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-semibold shadow min-w-[100px]">
      Filter
    </button>
  </div>
);

export default FilterBar;