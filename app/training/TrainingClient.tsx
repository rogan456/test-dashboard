'use client';
import React, { useState, useEffect, useTransition, useMemo } from 'react';
import TrainingFilterBar from '../components/TrainingFilterBar';
import TrainGeorgiaMap from '../components/TrainGeorgiaMap';
import TrainCollapsibleTable from '../components/TrainResTable';
import BlueCard from '../components/BlueCard';
import { subDays, subMonths } from 'date-fns';

export default function TrainingClient() {
  const [rowData, setRowData] = useState<any[]>([]);
  const [ceuCategoryFilter, setCeuCategoryFilter] = useState<string[]>([]);
  const [ceuTypeFilter, setCeuTypeFilter] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [cityFilter, setCityFilter] = useState<string[]>([]);
  const [districtFilter, setDistrictFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState('last30days');
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [populationFilter, setPopulationFilter] = useState<string[]>([]);

  // Calculate date range for filtering
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

  // Fetch all data ONCE, no date filtering in API
  useEffect(() => {
    setRowData([]);
    startTransition(() => {
      fetch('/api/trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
        .then(res => res.json())
        .then(data => {
          const rawItems = data.Items?.['$values'] ?? [];
          const mapped = rawItems.map((item: any) => ({
            Company: item.Company ?? '',
            CEUCategory: item['CEU Category'] ?? '',
            CeuType: item.CeuType ?? '',
            Date: item.Date ?? '',
            CityId: item.CityId ?? '',
            District: item.GMADIST ?? '',
            Population: item.DPOP ?? '',
          }));
          setRowData(mapped);
        });
    });
  }, []);

  // Unique filter options
  const ceuCategories = useMemo(
    () => Array.from(new Set(rowData.map(row => row.CEUCategory).filter(Boolean))),
    [rowData]
  );
  const ceuTypes = useMemo(
    () => Array.from(new Set(rowData.map(row => row.CeuType).filter(Boolean))),
    [rowData]
  );

  // Filtered data (date filter is now just a regular filter)
  const filteredData = useMemo(
    () =>
      rowData.filter(row =>
        (!ceuCategoryFilter.length || ceuCategoryFilter.includes(row.CEUCategory)) &&
        (!ceuTypeFilter.length || ceuTypeFilter.includes(row.CeuType)) &&
        (!cityFilter.length || cityFilter.includes(row.CityId)) &&
        (!districtFilter.length || districtFilter.includes(String(row.District))) &&
        (!populationFilter.length || populationFilter.some(popRange => {
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
        })) &&
        (!startDate || !row.Date || new Date(row.Date) >= startDate) &&
        (!endDate || !row.Date || new Date(row.Date) <= endDate)
      ),
    [rowData, ceuCategoryFilter, ceuTypeFilter, cityFilter, districtFilter, populationFilter, startDate, endDate]
  );

  // Example stats (customize as needed)
  const totalTrainings = filteredData.length;
  const totalCompanies = new Set(filteredData.map(row => row.Company)).size;

  return (
    <div className="px-6 py-6 flex flex-col gap-6">
      <TrainingFilterBar
        ceuCategories={ceuCategories}
        ceuCategoryFilter={ceuCategoryFilter}
        setCeuCategoryFilter={setCeuCategoryFilter}
        ceuTypes={ceuTypes}
        ceuTypeFilter={ceuTypeFilter}
        setCeuTypeFilter={setCeuTypeFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        customDateRange={customDateRange}
        setCustomDateRange={setCustomDateRange}
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
        districtFilter={districtFilter}
        setDistrictFilter={setDistrictFilter}
        populationFilter={populationFilter}
        setPopulationFilter={setPopulationFilter}
      />
      {isPending ? (
        <div className="text-center py-10 text-lg font-semibold">Gathering data...</div>
      ) : (
        <div className={isPending ? "pointer-events-none blur-sm opacity-90 transition-all" : ""}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="border w-full lg:w-1/2">
              <TrainGeorgiaMap />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              <div className="flex gap-4 w-full items-center">
                <BlueCard title="Total Trainings" value={totalTrainings} />
                <BlueCard title="Total Companies" value={totalCompanies} />
              </div>
              <TrainCollapsibleTable data={filteredData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}