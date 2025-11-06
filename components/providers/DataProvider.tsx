'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { DataPoint, DashboardState, TimeAggregation } from '@/lib/types';
import { aggregateByWindow, getWindowMs } from '@/lib/dataGenerator';
import { useDataStream } from '@/hooks/useDataStream';
import { measure } from '@/lib/performanceUtils';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface DataContextValue {
  state: DashboardState;
  dataWindow: DataPoint[];
  aggregated: DataPoint[];
  setAggregation: (agg: TimeAggregation) => void;
  setTimeRangeMs: (ms: number) => void;
  toggleCategory: (cat: string) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ initialData, children }: { initialData: DataPoint[]; children: React.ReactNode }) {
  const categories = useMemo(() => Array.from(new Set(initialData.map((d) => d.category))), [initialData]);
  const [data, setData] = useState<DataPoint[]>(initialData);
  const [aggregation, setAggregation] = useState<TimeAggregation>('raw');
  const [timeRangeMs, setTimeRangeMs] = useState<number>(5 * 60_000);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(categories));
  const { setDataProcessingTime } = usePerformanceMonitor();

  const updateIntervalMs = 100;
  const maxPoints = 120_000; // keep a long history without leaks

  const onBatch = useCallback(
    (batch: DataPoint[]) => {
      const { result, durationMs } = measure('batch', () => {
        const merged = [...data, ...batch];
        const cutoff = Date.now() - Math.max(timeRangeMs * 3, 60 * 60_000); // sliding ceiling
        const trimmed = merged.slice(-maxPoints).filter((d) => d.timestamp >= cutoff);
        return trimmed;
      });
      setDataProcessingTime(durationMs);
      setData(result);
    },
    [data, timeRangeMs]
  );

  useDataStream({ intervalMs: updateIntervalMs, maxPoints, onBatch });

  const dataWindow = useMemo(() => {
    const cutoff = Date.now() - timeRangeMs;
    return data.filter((d) => d.timestamp >= cutoff && selectedCategories.has(d.category));
  }, [data, timeRangeMs, selectedCategories]);

  const aggregated = useMemo(() => {
    const windowMs = getWindowMs(aggregation);
    if (!windowMs) return dataWindow;
    return aggregateByWindow(dataWindow, windowMs);
  }, [dataWindow, aggregation]);

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  }, []);

  const value: DataContextValue = {
    state: { data, categories, selectedCategories, timeRangeMs, aggregation, updateIntervalMs },
    dataWindow,
    aggregated,
    setAggregation,
    setTimeRangeMs,
    toggleCategory
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataContext must be used within DataProvider');
  return ctx;
}


