'use client';
import { TrashIcon } from '@heroicons/react/24/outline';
import React, { useMemo, useEffect } from 'react';
import Select from 'react-select';
import DiscreteSliderLabel from './PopSlider';
import cities from '../data/cities.json';
import dist from '../data/dist.json';

// Group CityIDs by district
const districtMap: { [districtId: string]: string[] } = {};

Object.entries(dist).forEach(([cityId, districtId]) => {
  if (!districtMap[districtId]) {
    districtMap[districtId] = [];
  }
  districtMap[districtId].push(cityId);
});

const districtOptions = Object.entries(districtMap).map(([districtId, cityIds]) => ({
  value: districtId,
  label: `District ${districtId}`,
  cityIds, // array of CityIDs in this district
}));

const cityOptions = Object.entries(cities).map(([id, name]) => {
  const cityName = name as string;
  return {
    value: id,
    label: cityName.charAt(0) + cityName.slice(1).toLowerCase(),
  };
});

const activityTypeOptions = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'visit', label: 'Visit' },
  { value: 'text', label: 'Text' },
  { value: 'district meeting', label: 'District Meeting' },
  { value: 'CALL', label: 'CALL' },
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
  districtFilter?: string;
  setDistrictFilter?: (district: string) => void;
  dateFilter: string;
  setDateFilter: (val: string) => void;
  customDateRange: { start: string; end: string };
  setCustomDateRange: (range: { start: string; end: string }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  showActivityType = true,
  cityFilter,
  setCityFilter,
  activityTypeFilter,
  setActivityTypeFilter,
  districtFilter,
  setDistrictFilter,
  dateFilter,
  setDateFilter,
  customDateRange,
  setCustomDateRange,
}) => {
  // Filter city options based on selected district
  const filteredCityOptions = useMemo(() => {
    if (!districtFilter) return cityOptions;
    const allowedCityIds = districtOptions.find(d => d.value === districtFilter)?.cityIds || [];
    return cityOptions.filter(opt => allowedCityIds.includes(opt.value));
  }, [districtFilter]);

  // Filter district options based on selected city
  const filteredDistrictOptions = useMemo(() => {
    if (!cityFilter) return districtOptions;
    return districtOptions.filter(d => d.cityIds.includes(cityFilter));
  }, [cityFilter]);

  // Reset cityFilter if not in selected district
  useEffect(() => {
    if (
      districtFilter &&
      cityFilter &&
      !filteredCityOptions.some(opt => opt.value === cityFilter)
    ) {
      setCityFilter('');
    }
  }, [districtFilter, cityFilter, filteredCityOptions, setCityFilter]);

  // Reset districtFilter if not in selected city
  useEffect(() => {
    if (
      cityFilter &&
      districtFilter &&
      !filteredDistrictOptions.some(opt => opt.value === districtFilter)
    ) {
      setDistrictFilter && setDistrictFilter('');
    }
  }, [cityFilter, districtFilter, filteredDistrictOptions, setDistrictFilter]);

  const handleReset = () => {
    setCityFilter('');
    setActivityTypeFilter('');
    if (setDistrictFilter) setDistrictFilter('');
    // Reset other filters here as needed
    setDateFilter(''); // or '' if you want to show all dates by default
    setCustomDateRange({ start: '', end: '' });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 pb-0 items-center rounded-xl w-full">
      <div className="border rounded flex-1 min-w-[140px] max-w-xs">
        <Select
          instanceId="district-select"
          options={filteredDistrictOptions}
          placeholder="District"
          value={filteredDistrictOptions.find(opt => opt.value === districtFilter) || null}
          onChange={selected => setDistrictFilter && setDistrictFilter(selected ? selected.value : '')}
          isClearable
        />
      </div>
      <div className="border rounded flex-1 min-w-[140px] max-w-xs">
        <Select
          instanceId="city-select"
          options={filteredCityOptions}
          placeholder="City"
          value={filteredCityOptions.find(opt => opt.value === cityFilter) || null}
          onChange={selected => setCityFilter(selected ? selected.value : '')}
          isClearable
        />
      </div>
      <div className="border rounded flex-1 min-w-[140px] max-w-xs">
  <Select
    options={dateOptions}
    placeholder="Date"
    value={dateOptions.find(opt => opt.value === dateFilter) || null}
    onChange={selected => setDateFilter(selected ? selected.value : '')}
    isClearable={false}
  />
  </div>
  {dateFilter === 'Custom' && (
    <div className="flex gap-2 items-center">
      <input
        type="date"
        value={customDateRange.start}
        onChange={e => setCustomDateRange({ ...customDateRange, start: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <span>to</span>
      <input
        type="date"
        value={customDateRange.end}
        onChange={e => setCustomDateRange({ ...customDateRange, end: e.target.value })}
        className="border rounded px-2 py-1"
      />
    </div>
  )}
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