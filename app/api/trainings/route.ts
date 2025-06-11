import { NextRequest, NextResponse } from 'next/server';
import { fetchTraining } from '@/app/training/fetchTraining';

export async function POST(req: NextRequest) {
  const {  } = await req.json();
  const data = await fetchTraining();
  return NextResponse.json(data);
}