'use client';
import GeorgiaMap from './components/GeorgiaMap';
import BlueCard from './components/BlueCard';
import Link from 'next/link';
import FilterBar from './components/FilterBar';
import GenStats from './components/GenStats';

export default function Home() {
  return (
    <div className="bg-white min-h-screen w-full">
            <div className="px-6 py-6 flex flex-col gap-6">
              <FilterBar showActivityType={false} />
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/2">
                  <GeorgiaMap />
                </div>
                <div className="w-full lg:w-1/2">
                  <GenStats />
          </div>
        </div>
      </div>
</div>

  );
}
