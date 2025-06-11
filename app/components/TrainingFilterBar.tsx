'use client';
import React from 'react';
import Select from 'react-select';
import { TrashIcon } from '@heroicons/react/24/outline';
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
    value: String(c.ID),
    label: c.CompanySort
      ? c.CompanySort
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      : '',
  };
});



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

interface TrainingFilterBarProps {
  ceuCategories: string[];
  ceuCategoryFilter: string[];
  setCeuCategoryFilter: (val: string[]) => void;
  ceuTypes: string[];
  ceuTypeFilter: string[];
  setCeuTypeFilter: (val: string[]) => void;
  cityFilter: string[];
  setCityFilter: (cities: string[]) => void;

  districtFilter: string[];
  setDistrictFilter: (districts: string[]) => void;
  dateFilter: string;
  setDateFilter: (val: string) => void;
  customDateRange: { start: string; end: string };
  setCustomDateRange: (range: { start: string; end: string }) => void;
  populationFilter: string[];
  setPopulationFilter: (pop: string[]) => void;
}

const TrainingFilterBar: React.FC<TrainingFilterBarProps> = ({
  ceuCategories,
  ceuCategoryFilter,
  setCeuCategoryFilter,
  ceuTypes,
  ceuTypeFilter,
  setCeuTypeFilter,
  cityFilter,
  setCityFilter,
  districtFilter,
  setDistrictFilter,
  dateFilter,
  setDateFilter,
  customDateRange,
  setCustomDateRange,
  populationFilter,
  setPopulationFilter,
}) => {
  const ceuCategoryOptions = ceuCategories.map(c => ({ value: c, label: c }));
  const ceuTypeOptions = ceuTypes.map(t => ({ value: t, label: t }));

  const handleReset = () => {
    setCeuCategoryFilter([]);
    setCeuTypeFilter([]);
    setCityFilter([]);
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
      <div className="border rounded flex-1 min-w-[140px] max-w-xs">
        <Select
          instanceId="ceu-category-select"
          options={ceuCategoryOptions}
          placeholder="CEU Category"
          value={ceuCategoryOptions.filter(opt => ceuCategoryFilter.includes(opt.value))}
          onChange={selected => setCeuCategoryFilter(selected ? selected.map((s: any) => s.value) : [])}
          isClearable
          isMulti
        />
      </div>
      <div className="border rounded flex-1 min-w-[140px] max-w-xs">
        <Select
          instanceId="ceu-type-select"
          options={ceuTypeOptions}
          placeholder="CEU Type"
          value={ceuTypeOptions.filter(opt => ceuTypeFilter.includes(opt.value))}
          onChange={selected => setCeuTypeFilter(selected ? selected.map((s: any) => s.value) : [])}
          isClearable
          isMulti
        />
      </div>
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
      <button
        type="button"
        onClick={handleReset}
        className="flex items-center justify-center bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition font-semibold shadow min-w-[44px]"
        title="Reset filters"
      >
        Reset
      </button>
    </div>
  );
};

export default TrainingFilterBar;