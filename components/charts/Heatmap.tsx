'use client';

import React, { useMemo, useRef } from 'react';
import { useDataContext } from '@/components/providers/DataProvider';
import { useChartRenderer } from '@/hooks/useChartRenderer';

export default function Heatmap() {
  const { dataWindow } = useDataContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const series = useMemo(() => {
    const x = dataWindow.map((d) => d.timestamp);
    const y = dataWindow.map((d) => d.value);
    return [{ x, y, color: '#60a5fa' }];
  }, [dataWindow]);

  useChartRenderer(canvasRef, { series, height: 260, kind: 'heatmap' });
  return <canvas ref={canvasRef} className="chartCanvas" />;
}


