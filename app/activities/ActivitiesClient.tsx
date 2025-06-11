'use client';
import React, { useState, useTransition, useMemo, useEffect } from 'react';
import FilterBar from '../components/ActivitiesFilterBar';
import CollapsibleTable from '../components/ActResTable';
import GeorgiaMap from '../components/ActGeorgiaMap';
import BlueCard from '../components/BlueCard';
import BasicSwitches from '../components/Switch';
import { subDays, subMonths, isAfter, isBefore, parseISO } from 'date-fns';
import cities from '../data/cities.json';

export default function ActivitiesClient() {
  const [rowData, setRowData] = useState<any[]>([]);
  const [cityFilter, setCityFilter] = useState<string[]>([]);
  const [activityTypeFilter, setActivityTypeFilter] = useState<string[]>([]);
  const [districtFilter, setDistrictFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState('last30days');
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [isPending, startTransition] = useTransition();
  const [flipped, setFlipped] = useState(false);
  //const [zoomToCity, setZoomToCity] = useState<string[]>([]);
  const [zoomToCities, setZoomToCities] = useState<string[]>([]);
  const [populationFilter, setPopulationFilter] = useState<string[]>([]);


  //const handleReset = () => setZoomToCity(null);
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
  if (!startDate || !endDate) return;
  setRowData([]);
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
          Notes: item.Notes ?? '',
          StaffInvolved: item.StaffInvolved ?? '',
          CityId: String(item.CityId) ?? '',
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
  const matchesDistrict = districtFilter.length && districtFilter.includes(String(row.District));
  const matchesCity = cityFilter.length && cityFilter.includes(row.CityId);

  // If either filter is set, match if either matches; if neither is set, show all
  const passesLocation =
    (districtFilter.length || cityFilter.length)
      ? matchesDistrict || matchesCity
      : true;
  const popMatch =
  !populationFilter.length ||
  populationFilter.some(popRange => {
    const pop = Number(row.Population);
    if (popRange === 'lt500') return pop < 500;
    if (popRange === '500to999') return pop >= 500 && pop <= 999;
    if (popRange === '1000to2499') return pop >= 1000 && pop <= 2499;
    if (popRange === '2500to4999') return pop >= 2500 && pop <= 4999;
    if (popRange === '5000to9999') return pop >= 5000 && pop <= 9999;
    if (popRange === '10000to24999') return pop >= 10000 && pop <= 24999;
    if (popRange === '25000to49999') return pop >= 25000 && pop <= 49999;
    if (popRange === '50000plus') return pop >= 50000;
    return false;
  });
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
  return passesLocation && activityMatch && dateMatch && popMatch;
});

  const allRelevantCityIds = useMemo(() => {
  const ids = new Set();

  // Add all cities from selected districts
  if (districtFilter.length) {
    cities.forEach(city => {
      if (districtFilter.includes(String(city.GMADIST))) {
        ids.add(city.ID);
      }
    });
  }

  // Add all selected cities
  cityFilter.forEach(id => ids.add(id));

  // If no filters, use all cities
  if (!districtFilter.length && !cityFilter.length) {
    cities.forEach(city => ids.add(city.ID));
  }

  return ids;
}, [districtFilter, cityFilter]);
  const totalCitiesDynamic = allRelevantCityIds.size;
  const citiesEngaged = Array.from(new Set(filteredData.map(row => row.CityId))).length;
  const citiesNotEngaged = totalCitiesDynamic - citiesEngaged;
  const totalEngagement = ((citiesEngaged / totalCitiesDynamic) * 100).toFixed(1) + '%';
  const cityActivityCounts = Object.values(
    filteredData.reduce((acc, row) => {
      const key = row.CitySort;
      if (!acc[key]) {
        acc[key] = { CitySort: row.CitySort, count: 0, Population: row.Population }; 
      }
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { CitySort: string; count: number; Population?: string }>)
  ) as { CitySort: string; count: number; Population?: string }[];
  const handleCitySelect = (cityName: string) => {
    const city = rowData.find(row => row.CitySort === cityName );
    if (city){
      setCityFilter([city.CityId]);
    }
  }
  {/*useEffect(() => {
  if (cityFilter.length === 1) {
    const city = filteredData.find(row => row.CityId === cityFilter[0]);
    if (city) {
      setZoomToCity(city.CitySort);
    }
  } else {
    setZoomToCity(null);
  }
}, [cityFilter, filteredData.length]);*/}
useEffect(() => {
  if (cityFilter.length > 0) {
    // Find all matching cities in filteredData
    const cities = filteredData
      .filter(row => cityFilter.includes(row.CityId))
      .map(row => row.CitySort);
    setZoomToCities(cities);
  } else {
    setZoomToCities([]);
  }
}, [cityFilter, filteredData.length]);

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
      populationFilter={populationFilter}
      setPopulationFilter={setPopulationFilter}
    />
    {isPending  ? (
      <div className="text-center py-10 text-lg font-semibold">Gathering data...</div>
    ) : (
      <div className={isPending ? "pointer-events-none blur-sm opacity-90 transition-all" : ""}>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="border w-full lg:w-1/2">
            <GeorgiaMap
                cityActivityData={cityActivityCounts.map(({ CitySort, count, Population }) => ({
                  CityName: CitySort,
                  count,
                  Population
                }))}
                zoomToCities={zoomToCities}
                onCitySelect={handleCitySelect}
                />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="flex gap-4 w-full items-center">
              <BlueCard title="Total Activities" value={filteredData.length} />
              <BlueCard
                title={flipped ? 'Cities Not Engaged' : 'Cities Engaged'}
                value={flipped ? citiesNotEngaged : citiesEngaged}
              />
              <BlueCard title="Total Cities" value={totalCitiesDynamic} />
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