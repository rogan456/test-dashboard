import React, { useState } from 'react';

interface NotEngagedCity {
  CityId: string;
  CityName: string;
  Population?: string;
}

interface ActFlipResTableProps {
  notEngagedCities: NotEngagedCity[];
}

export default function ActFlipResTable({ notEngagedCities }: ActFlipResTableProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(notEngagedCities.length / pageSize);
  const paginated = notEngagedCities.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full max-w-md mx-auto overflow-x-auto rounded-2xl shadow-lg bg-white border border-gray-200">
      <table className="w-full">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-3 text-left t-2xl">Cities Not Engaged</th>
            <th className="p-3 text-left t-2xl">Population</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((city, idx) => (
            <tr key={idx} className="border-b last:border-b-0 hover:bg-blue-50 transition">
              <td className="p-2">{city.CityName}</td>
              <td className="p-2">{city.Population}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 py-4">
        <button
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}