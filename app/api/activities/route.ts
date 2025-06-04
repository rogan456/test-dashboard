import { NextRequest, NextResponse } from 'next/server';
import { fetchActivities } from '@/app/activities/fetchActivities';

export async function POST(req: NextRequest) {
  const { startDate, endDate } = await req.json();
  const data = await fetchActivities(startDate, endDate);
  return NextResponse.json(data);
}