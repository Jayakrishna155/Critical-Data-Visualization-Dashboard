'use client';

import React, { useMemo, useRef } from 'react';
import { useDataContext } from '@/components/providers/DataProvider';
import { useChartRenderer } from '@/hooks/useChartRenderer';

export default function LineChart() {
  const { aggregated } = useDataContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const series = useMemo(() => {
    if (!aggregated.length) return [] as { x: number[]; y: number[]; color: string }[];
    const x = aggregated.map((d) => d.timestamp);
    const y = aggregated.map((d) => d.value);
    return [{ x, y, color: '#6ee7b7' }];
  }, [aggregated]);

  useChartRenderer(canvasRef, { series, height: 260, kind: 'line' });

  return <canvas ref={canvasRef} className="chartCanvas" />;
}


