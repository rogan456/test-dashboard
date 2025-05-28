import React from 'react';
import GeorgiaMap from '../components/GeorgiaMap';
import BlueCard from '../components/BlueCard';
import FilterBar from '../components/FilterBar';
import CollapsibleTable from '../components/ResTable';
import { fetchActivities } from './fetchActivities';

interface ActivityItem {
  CityId: number;
  // add other properties as needed
}

export default async function Page() {
  const activitiesData = await fetchActivities();

  const rawItems: ActivityItem[] = activitiesData.Items?.['$values'] ?? [];
  const totalActivities = activitiesData.TotalCount ?? 0;

  const uniqueCityIds = new Set(rawItems.map(item => item.CityId));
  const totalCities = uniqueCityIds.size;

  // Map rawItems to RowData type
  const rowData = rawItems.map(item => ({
    ActivityDate: (item as any).ActivityDate ?? '',
    ActivityType: (item as any).ActivityType ?? '',
    CityName: (item as any).CityName ?? '',
    Notes: (item as any).Notes ?? '',
    StaffInvolved: (item as any).StaffInvolved ?? '',
    CityId: item.CityId,
    // add other properties as needed
  }));

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="px-6 py-6 flex flex-col gap-6">
        <FilterBar />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2">
            <GeorgiaMap />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <BlueCard title="Total Activities" value={1250} />
              <BlueCard title="Cities Engaged" value={434} flippable backTitle="Cities Not Engaged" backValue={103} />
              <BlueCard title="Total engagement" value="80.8%" />
            </div>
            <CollapsibleTable data={rowData}/>
          </div>
        </div>
      </div>
    </div>
  );
}
