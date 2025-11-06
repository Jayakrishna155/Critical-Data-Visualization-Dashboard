'use client';

import { useCallback, useEffect, useRef } from 'react';
import { DataPoint } from '@/lib/types';
import { generateBatch } from '@/lib/dataGenerator';

export interface DataStreamOptions {
  intervalMs: number;
  maxPoints: number;
  onBatch: (batch: DataPoint[]) => void;
}

/**
 * Generates time-series data in batches at a fixed interval.
 * Keeps work minimal on the main thread.
 */
export function useDataStream({ intervalMs, maxPoints, onBatch }: DataStreamOptions) {
  const runningRef = useRef(false);
  const sinceRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    const since = sinceRef.current;
    const batch = generateBatch({ points: Math.max(50, Math.floor(100 / intervalMs) * 20), since });
    sinceRef.current = batch[batch.length - 1]?.timestamp ?? since;
    onBatch(batch);
  }, [intervalMs, onBatch]);

  useEffect(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    // kick once immediately to reduce startup latency
    tick();
    timerRef.current = window.setInterval(tick, intervalMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      runningRef.current = false;
    };
  }, [intervalMs, tick, maxPoints]);
}


