'use client';
import React, { useState } from 'react';

type RowData = {
  Company: string;
  CEUCategory: string;
  CeuType: string;
};

export default function TrainCollapsibleTable({ data = [] }: { data?: RowData[] }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.ceil(data.length / pageSize);

  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full overflow-x-auto rounded-2xl shadow-lg bg-white border border-gray-200">
      <table className="w-full min-w-[600px]">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-2 text-left">Location</th>
            <th className="p-2 text-left">CEU Category</th>
            <th className="p-2 text-left">CEU Type</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, idx) => (
            <tr key={idx + (page - 1) * pageSize} className="border-b last:border-b-0 hover:bg-blue-50 transition rounded-lg">
              <td className="p-2 break-words">{row.Company}</td>
              <td className="p-2 break-words">{row.CEUCategory}</td>
              <td className="p-2 break-words">{row.CeuType}</td>
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