'use client';
import React, { useState, useTransition, useMemo, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import CollapsibleTable from '../components/ResTable';
import GeorgiaMap from '../components/GeorgiaMap';
import BlueCard from '../components/BlueCard';
import BasicSwitches from '../components/Switch';
import { subDays, subMonths, isAfter, isBefore, parseISO } from 'date-fns';

// Import your API proxy route (recommended) or fetch directly if safe
// Example: /api/activities (see previous answers for API route setup)

export default function ActivitiesClient() {
  const [rowData, setRowData] = useState<any[]>([]);
  const [cityFilter, setCityFilter] = useState<string[]>([]);
  const [activityTypeFilter, setActivityTypeFilter] = useState<string[]>([]);
  const [districtFilter, setDistrictFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState('last30days');
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [isPending, startTransition] = useTransition();
  const [flipped, setFlipped] = useState(false);

  const { startDate, endDate } = useMemo(() => {
  const now = new Date();
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (dateFilter === 'last30days') {
    startDate = subDays(now, 30);
    endDate = now;
  } else if (dateFilter === 'last90days') {
    startDate = subDays(now, 90);
    endDate = now;
  } else if (dateFilter === 'last6months') {
    startDate = subMonths(now, 6);
    endDate = now;
  } else if (dateFilter === 'last12months') {
    startDate = subMonths(now, 12);
    endDate = now;
  } else if (dateFilter === 'Custom' && customDateRange.start && customDateRange.end) {
    startDate = new Date(customDateRange.start);
    endDate = new Date(customDateRange.end);
  }
  return { startDate, endDate };
}, [dateFilter, customDateRange]);
  // Fetch data when date filter changes
  useEffect(() => {
  console.log('useEffect running', startDate, endDate);
  if (!startDate || !endDate) return;
  startTransition(() => {
    fetch('/api/activities', { // <-- FIXED HERE
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: startDate.toLocaleDateString('en-US'),
        endDate: endDate.toLocaleDateString('en-US'),
      }),
    })
      .then(res => res.json())
      .then(data => {
        const rawItems = data.Items?.['$values'] ?? [];
        const mapped = rawItems.map((item: any) => ({
          ActivityDate: item.ActivityDate ?? '',
          ActivityType: item.ActivityType ?? '',
          CityName: item.CityName ?? '',
          Notes: item.Notes ?? '',
          StaffInvolved: item.StaffInvolved ?? '',
          CityId: item.CityId,
          CitySort: item.CitySort ?? '',
          EnteredByStaffName: item.EnteredByStaffName ?? '',
          Population: item.Population ?? '',
          District: item.District ?? '',
        }));
        setRowData(mapped);
      });
  });
}, [startDate, endDate]);

  // Apply other filters to the fetched data
  const filteredData = rowData.filter(row => {
    const districtMatch = !districtFilter.length || districtFilter.includes(String(row.District));
    const cityMatch = !cityFilter.length || cityFilter.includes(String(row.CityId));
    const activityMatch = !activityTypeFilter.length || activityTypeFilter.includes(row.ActivityType.toLowerCase());
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
  const uniqueCityIds = Array.from(new Set(filteredData.map(row => row.CityId)));
  const citiesEngaged = uniqueCityIds.length;
  const citiesNotEngaged = TOTAL_CITIES - citiesEngaged;
  const totalEngagement = ((citiesEngaged / TOTAL_CITIES) * 100).toFixed(1) + '%';

  return (
  <div className="px-6 py-6 flex flex-col gap-6">
    <FilterBar
      cityFilter={cityFilter}
      setCityFilter={setCityFilter}
      activityTypeFilter={activityTypeFilter}
      setActivityTypeFilter={setActivityTypeFilter}
      districtFilter={districtFilter}
      setDistrictFilter={setDistrictFilter}
      dateFilter={dateFilter}
      setDateFilter={setDateFilter}
      customDateRange={customDateRange}
      setCustomDateRange={setCustomDateRange}
    />
    {isPending && rowData.length === 0 ? (
      <div className="text-center py-10 text-lg font-semibold">Loading...</div>
    ) : (
      <div className={isPending ? "pointer-events-none blur-sm opacity-90 transition-all" : ""}>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2">
            <GeorgiaMap activityData={filteredData} />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="flex gap-4 w-full items-center">
              <BlueCard title="Total Activities" value={filteredData.length} />
              <BlueCard
                  title={flipped ? 'Cities Not Engaged' : 'Cities Engaged'}
                  value={flipped ? citiesNotEngaged : citiesEngaged}
                />
              <BlueCard title="Total engagement" value={totalEngagement} />
              <div className="flex-none w-auto pl-2">
                <BasicSwitches checked={flipped} onChange={setFlipped} />
              </div>
            </div>
            <CollapsibleTable data={filteredData} />
          </div>
        </div>
      </div>
    )}
  </div>
  );
}