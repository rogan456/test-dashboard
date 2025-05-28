'use client';
import React, { useState } from 'react';

type RowData = {
  ActivityDate: string;
  ActivityType: string;
  CityName: string;
  Notes: string;
  StaffInvolved: string;
};

function CollapsibleRow({ row }: { row: RowData }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="border-b last:border-b-0 hover:bg-blue-50 transition rounded-lg">
        <td className="p-2 text-center">
          <button
            onClick={() => setOpen((o) => !o)}
            className="focus:outline-none"
            aria-label={open ? 'Collapse row' : 'Expand row'}
          >
            <span className="inline-block w-5 h-5 text-blue-600">
              {open ? (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </span>
          </button>
        </td>
        <td className="p-2 break-words">
  {new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(row.ActivityDate))}
</td>

        <td className="p-2 break-words">{row.ActivityType}</td>
        <td className="p-2 break-words">{row.CityName}</td>
      </tr>
      {open && (
        <tr className="bg-blue-50 rounded-b-lg">
          <td colSpan={4} className="p-4 rounded-b-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-1 text-blue-600">Notes</th>
                    <th className="text-right p-1 text-blue-600">Staff Involved</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1 break-words">{row.Notes}</td>
                    <td className="p-1 text-right">{row.StaffInvolved}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function CollapsibleTable({ data = [] }: { data?: RowData[] }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.ceil(data.length / pageSize);

  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full overflow-x-auto rounded-2xl shadow-lg bg-white border border-gray-200">
      <table className="w-full min-w-[600px]">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-2 w-10 rounded-tl-2xl"></th>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Activity Type</th>
            <th className="p-2 text-left rounded-tr-2xl">Location</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, idx) => (
            <CollapsibleRow key={idx + (page - 1) * pageSize} row={row} />
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
          Page {page} of {pageCount}
        </span>
        <button
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page === pageCount}
        >
          Next
        </button>
      </div>
    </div>
  );
}