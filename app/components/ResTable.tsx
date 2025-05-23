'use client';
import React, { useState } from 'react';

type Detail = { Comment: string; Others: number };
type RowData = {
  date: string;
  activityType: string;
  location: string;
  details: Detail[];
};

const rows: RowData[] = [
  {
    date: '2024-05-01',
    activityType: 'Training',
    location: 'Atlanta',
    details: [{ Comment: 'Leadership Workshop', Others: 30 }],
  },
  {
    date: '2024-05-03',
    activityType: 'Event',
    location: 'Savannah',
    details: [{ Comment: 'Annual Meetup', Others: 120 }],
  },
  {
    date: '2024-05-05',
    activityType: 'Seminar',
    location: 'Augusta',
    details: [{ Comment: 'Safety Seminar', Others: 45 }],
  },
  {
    date: '2024-05-07',
    activityType: 'Workshop',
    location: 'Macon',
    details: [{ Comment: 'Tech Workshop', Others: 25 }],
  },
  {
    date: '2024-05-10',
    activityType: 'Conference',
    location: 'Columbus',
    details: [{ Comment: 'City Conference', Others: 80 }],
  },
];

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
        <td className="p-2 break-words">{row.date}</td>
        <td className="p-2 break-words">{row.activityType}</td>
        <td className="p-2 break-words">{row.location}</td>
      </tr>
      {open && (
        <tr className="bg-blue-50 rounded-b-lg">
          <td colSpan={4} className="p-4 rounded-b-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-1 text-blue-600">Comment</th>
                    <th className="text-right p-1 text-blue-600">Others</th>
                  </tr>
                </thead>
                <tbody>
                  {row.details.map((detail, idx) => (
                    <tr key={idx}>
                      <td className="p-1 break-words">{detail.Comment}</td>
                      <td className="p-1 text-right">{detail.Others}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function CollapsibleTable() {
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
          {rows.map((row, idx) => (
            <CollapsibleRow key={idx} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}