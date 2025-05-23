import React from 'react';
import GeorgiaMap from '../components/GeorgiaMap';
import BlueCard from '../components/BlueCard';
import FilterBar from '../components/FilterBar';
import CollapsibleTable from '../components/ResTable';

const page = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-4 flex flex-col h-full">
        <FilterBar />
        <div className="flex flex-col lg:flex-row flex-1 gap-6 h-full">
          <div className="w-full lg:w-1/3 p-0 lg:p-4 lg:pl-6 flex h-[400px] lg:h-auto">
            <GeorgiaMap />
          </div>
          <div className="w-full lg:w-2/3 p-0 lg:p-4 flex flex-col items-start">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6">
              <BlueCard title="Total Activities" value={1250} />
              <BlueCard title="Cities Engaged" value={434} flippable backTitle="Cities Not Engaged" backValue={103} />
              <BlueCard title="Total engagement" value="80.8%" />
            </div>
            <CollapsibleTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;