import { DataPoint } from './types';

const CATEGORY_POOL = ['alpha', 'beta', 'gamma', 'delta'];

export async function generateInitialDataset({ points }: { points: number }): Promise<DataPoint[]> {
  const now = Date.now();
  return generateBatch({ points, since: now - points * 100 });
}

export function generateBatch({ points, since }: { points: number; since: number }): DataPoint[] {
  const out: DataPoint[] = new Array(points);
  let last = since;
  let val = Math.random() * 100;
  for (let i = 0; i < points; i++) {
    last += 100; // 100ms spacing
    // random walk with bounded noise
    val += (Math.random() - 0.5) * 2.5;
    if (val < 0) val = 0;
    const category = CATEGORY_POOL[(i + (since % 4)) % CATEGORY_POOL.length];
    out[i] = {
      timestamp: last,
      value: val,
      category
    };
  }
  return out;
}

export function aggregateByWindow(data: DataPoint[], windowMs: number): DataPoint[] {
  if (windowMs <= 0) return data;
  const buckets: Record<number, { sum: number; count: number; ts: number; cat: string }> = {};
  for (const d of data) {
    const key = Math.floor(d.timestamp / windowMs) * windowMs;
    const b = (buckets[key] ||= { sum: 0, count: 0, ts: key, cat: d.category });
    b.sum += d.value;
    b.count += 1;
  }
  const out: DataPoint[] = [];
  for (const k of Object.keys(buckets)) {
    const b = buckets[Number(k)];
    out.push({ timestamp: b.ts, value: b.sum / Math.max(1, b.count), category: b.cat });
  }
  out.sort((a, b) => a.timestamp - b.timestamp);
  return out;
}

export function getWindowMs(agg: 'raw' | '1m' | '5m' | '1h'): number {
  switch (agg) {
    case '1m':
      return 60_000;
    case '5m':
      return 300_000;
    case '1h':
      return 3_600_000;
    case 'raw':
    default:
      return 0;
  }
}


