import { NextResponse } from 'next/server';
import { generateBatch } from '@/lib/dataGenerator';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const points = Number(searchParams.get('points') ?? 1000);
  const since = Number(searchParams.get('since') ?? Date.now() - 60_000);

  const data = generateBatch({ points, since });
  return NextResponse.json({ data });
}


