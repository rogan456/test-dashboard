'use client';
import React, { useState, useTransition } from 'react';
import FilterBar from '../components/FilterBar';
import CollapsibleTable from '../components/ResTable';
import GeorgiaMap from '../components/GeorgiaMap';
import BlueCard from '../components/BlueCard';
import BasicSwitches from '../components/Switch';

{/*}

type rowData = {
  ActivityDate: string;
  ActivityType: string;
  CityName: string;
  Notes: string;
  StaffInvolved: string;
  CitySort: string;
  EnteredByStaffName: string;
};

export default function ActivitiesClient({ rowData }: { rowData: any[] }) {
  const [cityFilter, setCityFilter] = useState('');

  const filteredData = cityFilter
    ? rowData.filter(row => row.CitySort.toLowerCase() === cityFilter.toLowerCase())
    : rowData;

  return (
    <div className="px-6 py-6 flex flex-col gap-6">
      <FilterBar cityFilter={cityFilter} setCityFilter={setCityFilter} />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2">
          <GeorgiaMap />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="flex gap-4 w-full items-center">
            <BlueCard title="Total Activities" value={filteredData.length} />
            <BlueCard title="Cities Engaged" value={434} flippable backTitle="Cities Not Engaged" backValue={103} />
            <BlueCard title="Total engagement" value="80.8%" />
            <BlueCard title="Total engagement" value="80.8%" />
            <div className="flex-none w-auto pl-2">
              <BasicSwitches />
            </div>
          </div>
          <CollapsibleTable data={filteredData} />
        </div>
      </div>
    </div>
  );
}
*/}

export default function ActivitiesClient({ rowData }: { rowData: any[] }) {
  const [cityFilter, setCityFilter] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  const filteredData = rowData.filter(row => {
  const cityMatch = !cityFilter || row.CitySort.toLowerCase() === cityFilter.toLowerCase();
  const activityMatch = !activityTypeFilter || row.ActivityType.toLowerCase() === activityTypeFilter.toLowerCase();
  return cityMatch && activityMatch;
});

  // Wrap setCityFilter in startTransition for a smoother UI
  const handleCityFilter = (city: string) => {
    startTransition(() => {
      setCityFilter(city);
    });
  };

  return (
    <div className="px-6 py-6 flex flex-col gap-6">
      <FilterBar
  cityFilter={cityFilter}
  setCityFilter={handleCityFilter}
  activityTypeFilter={activityTypeFilter}
  setActivityTypeFilter={setActivityTypeFilter}
/>
      {/* Blur the content if pending */}
      <div className={isPending ? "pointer-events-none blur-sm opacity-60 transition-all" : ""}>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2">
            <GeorgiaMap />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="flex gap-4 w-full items-center">
              <BlueCard title="Total Activities" value={filteredData.length} />
              <BlueCard title="Cities Engaged" value={434} flippable backTitle="Cities Not Engaged" backValue={103} />
              <BlueCard title="Total engagement" value="80.8%" />
              <BlueCard title="Total engagement" value="80.8%" />
              <div className="flex-none w-auto pl-2">
                <BasicSwitches />
              </div>
            </div>
            <CollapsibleTable data={filteredData} />
          </div>
        </div>
      </div>
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <span className="text-xl font-semibold text-blue-600 animate-pulse bg-white/80 px-6 py-4 rounded-xl shadow-lg">
            Gathering data...
          </span>
        </div>
      )}
    </div>
  );
}