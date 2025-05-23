'use client';
import GeorgiaMap from './components/GeorgiaMap';
import BlueCard from './components/BlueCard';
import Link from 'next/link';
import FilterBar from './components/FilterBar';

export default function Home() {
  return (
    <div className="bg-white min-h-screen w-full">
      {/* Outer container that centers everything and constrains width */}
      <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
        
        {/* Filter Bar */}
        <FilterBar showActivityType={false} />

        {/* Main layout: map and cards side by side */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left: Map */}
          <div className="w-full lg:w-1/2">
            <GeorgiaMap />
          </div>

          {/* Right: Blue cards */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/activities">
                <BlueCard title="Total Activities" value={1250} />
              </Link>
              <Link href="/trainings">
                <BlueCard title="Total trainings" value={50} />
              </Link>
              <Link href="/programs">
                <BlueCard title="Total programs" value={200} />
              </Link>
              <Link href="/events">
                <BlueCard title="Total events" value={200} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
