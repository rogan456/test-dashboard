'use client';
import { TrashIcon } from '@heroicons/react/24/outline';
import React, { useMemo, useEffect } from 'react';
import Select from 'react-select';
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
  cityIds,
}));

type City = { ID: string | number; CompanySort?: string };

const cityOptions = (Array.isArray(cities) ? cities : Object.values(cities)).map(city => {
  const c = city as City;
  return {
    value: String(c.ID), // Use the string CityId
    label: c.CompanySort
      ? c.CompanySort.charAt(0) + c.CompanySort.slice(1).toLowerCase()
      : '',
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

const popOptions = [
  { value: 'lt500', label: 'Less than 500' },
  { value: '500to999', label: '500 - 999' },
  { value: '1000to2499', label: '1,000 - 2,499' },
  { value: '2500to4999', label: '2,500 - 2,999' },
  { value: '5000to9999', label: '5,000 - 9,999' },
  { value: '10000to24999', label: '10,000 - 24,999' },
  { value: '25000to49999', label: '25,000 - 49,999' },
  { value: '50000plus', label: '50,000+' },
];

interface FilterBarProps {
  showActivityType?: boolean;
  cityFilter: string[];
  setCityFilter: (cities: string[]) => void;
  activityTypeFilter: string[];
  setActivityTypeFilter: (types: string[]) => void;
  districtFilter: string[];
  setDistrictFilter: (districts: string[]) => void;
  dateFilter: string;
  setDateFilter: (val: string) => void;
  customDateRange: { start: string; end: string };
  setCustomDateRange: (range: { start: string; end: string }) => void;
   populationFilter: string[];
  setPopulationFilter: (pop: string[]) => void;
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
  populationFilter,
  setPopulationFilter,
}) => {
  // Filter city options based on selected district(s)
  {/*const filteredCityOptions = useMemo(() => {
    if (!districtFilter.length) return cityOptions;
    const allowedCityIds = districtOptions
      .filter(d => districtFilter.includes(d.value))
      .flatMap(d => d.cityIds);
    return cityOptions.filter(opt => allowedCityIds.includes(opt.value));
  }, [districtFilter]);

  // Filter district options based on selected city(s)
  const filteredDistrictOptions = useMemo(() => {
    if (!cityFilter.length) return districtOptions;
    return districtOptions.filter(d =>
      d.cityIds.some(cityId => cityFilter.includes(cityId))
    );
  }, [cityFilter]);

  // Reset cityFilter if not in selected district(s)
  useEffect(() => {
    if (
      districtFilter.length &&
      cityFilter.length &&
      !cityFilter.every(cityId =>
        filteredCityOptions.some(opt => opt.value === cityId)
      )
    ) {
      setCityFilter(cityFilter.filter(cityId =>
        filteredCityOptions.some(opt => opt.value === cityId)
      ));
    }
  }, [districtFilter, cityFilter, filteredCityOptions, setCityFilter]);

  // Reset districtFilter if not in selected city(s)
  useEffect(() => {
    if (
      cityFilter.length &&
      districtFilter.length &&
      !districtFilter.every(districtId =>
        filteredDistrictOptions.some(opt => opt.value === districtId)
      )
    ) {
      setDistrictFilter(districtFilter.filter(districtId =>
        filteredDistrictOptions.some(opt => opt.value === districtId)
      ));
    }
  }, [cityFilter, districtFilter, filteredDistrictOptions, setDistrictFilter]);*/}

  const handleReset = () => {
    setCityFilter([]);
    setActivityTypeFilter([]);
    setDistrictFilter([]);
    setDateFilter('last30days');
    setCustomDateRange({ start: '', end: '' });
    setPopulationFilter([]);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 pb-0 items-center rounded-xl w-full">
      <div className="border rounded flex-1 min-w-[140px] max-w-xs">
        <Select
          instanceId="district-select"
          options={districtOptions}
          placeholder="District"
          value={districtOptions.filter(opt => districtFilter.includes(opt.value))}
          onChange={selected => setDistrictFilter(selected ? selected.map((s: any) => s.value) : [])}
          isClearable
          isMulti
        />
      </div>
      <div className="border rounded flex-1 min-w-[140px] max-w-xs">
        <Select
          instanceId="city-select"
          options={cityOptions}
          placeholder="City"
          value={cityOptions.filter(opt => cityFilter.includes(opt.value))}
          onChange={selected => setCityFilter(selected ? selected.map((s: any) => s.value) : [])}
          isClearable
          isMulti
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
            value={activityTypeOptions.filter(opt => activityTypeFilter.includes(opt.value))}
            onChange={selected => setActivityTypeFilter(selected ? selected.map((s: any) => s.value) : [])}
            isClearable
            isMulti
          />
          </div>
        
      )}
        <div className="border rounded flex-1 min-w-[140px] max-w-xs">
                <Select
                  instanceId="population-select"
                  options={popOptions}
                  placeholder="Population"
                  value={popOptions.filter(opt => populationFilter.includes(opt.value))}
                  onChange={selected => setPopulationFilter(selected ? selected.map((s: any) => s.value) : [])}
                  isClearable
                  isMulti
                />
        </div>
              
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