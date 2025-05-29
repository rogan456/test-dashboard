'use client';
import React, { useState } from 'react';
import FilterBar from '../components/FilterBar';
import CollapsibleTable from '../components/ResTable';
import GeorgiaMap from '../components/GeorgiaMap';
import BlueCard from '../components/BlueCard';

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <BlueCard title="Total Activities" value={filteredData.length} />
            <BlueCard title="Cities Engaged" value={434} flippable backTitle="Cities Not Engaged" backValue={103} />
            <BlueCard title="Total engagement" value="80.8%" />
          </div>
          <CollapsibleTable data={filteredData} />
        </div>
      </div>
    </div>
  );
}