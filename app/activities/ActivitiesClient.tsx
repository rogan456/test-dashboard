'use client';
import React, { useState, useTransition } from 'react';
import FilterBar from '../components/FilterBar';
import CollapsibleTable from '../components/ResTable';
import GeorgiaMap from '../components/GeorgiaMap';
import BlueCard from '../components/BlueCard';
import BasicSwitches from '../components/Switch';
import { subDays, subMonths, isAfter, isBefore, parseISO } from 'date-fns';





export default function ActivitiesClient({ rowData }: { rowData: any[] }) {
  const [cityFilter, setCityFilter] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('last30days'); // default to last 30 days
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [isPending, startTransition] = useTransition();

  const now = new Date();
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (dateFilter === 'last30days') startDate = subDays(now, 30);
  else if (dateFilter === 'last90days') startDate = subDays(now, 90);
  else if (dateFilter === 'last6months') startDate = subMonths(now, 6);
  else if (dateFilter === 'last12months') startDate = subMonths(now, 12);
  else if (dateFilter === 'Custom' && customDateRange.start && customDateRange.end) {
    startDate = new Date(customDateRange.start);
    endDate = new Date(customDateRange.end);
  }

  const filteredData = rowData.filter(row => {
  const districtMatch = !districtFilter || String(row.District) === districtFilter;
  const cityMatch = !cityFilter || String(row.CityId) === cityFilter;
  const activityMatch = !activityTypeFilter || row.ActivityType.toLowerCase() === activityTypeFilter.toLowerCase();
  let dateMatch = true;
  if (startDate) {
    const activityDate = row.ActivityDate ? parseISO(row.ActivityDate) : null;
    if (activityDate) {
      if (endDate) {
        dateMatch = isAfter(activityDate, startDate) && isBefore(activityDate, endDate);
      } else {
        dateMatch = isAfter(activityDate, startDate);
      }
    }
  }
  return districtMatch && cityMatch && activityMatch && dateMatch;
});
  const TOTAL_CITIES = 536;
  const uniqueCityIds = Array.from(
    new Set(filteredData.map(row => row.CityId))
  );
  const citiesEngaged = uniqueCityIds.length;
  const citiesNotEngaged = TOTAL_CITIES - citiesEngaged;
  const totalEngagement = ((citiesEngaged / TOTAL_CITIES) * 100).toFixed(1) + '%';


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
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
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
              <BlueCard title="Cities Engaged" value={citiesEngaged} flippable backTitle="Cities Not Engaged" backValue={citiesNotEngaged} />
              <BlueCard title="Total engagement" value={totalEngagement} />
              <div className="flex-none w-auto pl-2">
                <BasicSwitches />
              </div>
            </div>
            <CollapsibleTable data={filteredData} />
          </div>
        </div>
      </div>
    </div>
  );
}