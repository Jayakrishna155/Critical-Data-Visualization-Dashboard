'use client';

import React, { useMemo, useRef } from 'react';
import { useDataContext } from '@/components/providers/DataProvider';
import { useChartRenderer } from '@/hooks/useChartRenderer';

export default function BarChart() {
  const { aggregated } = useDataContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const series = useMemo(() => {
    const x = aggregated.map((d) => d.timestamp);
    const y = aggregated.map((d) => d.value);
    return [{ x, y, color: '#60a5fa' }];
  }, [aggregated]);

  useChartRenderer(canvasRef, { series, height: 260, kind: 'bar' });
  return <canvas ref={canvasRef} className="chartCanvas" />;
}


