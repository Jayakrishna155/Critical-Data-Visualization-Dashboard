'use client';

import React from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

export default function PerformanceMonitor() {
  const { metrics } = usePerformanceMonitor();
  const memMb = metrics.memoryUsage ? (metrics.memoryUsage / (1024 * 1024)).toFixed(1) : 'n/a';
  return (
    <div className="row" style={{ gap: 8 }}>
      <span className="pill">FPS: <strong>{metrics.fps}</strong></span>
      <span className="pill">Mem: {memMb} MB</span>
      <span className="pill">Render: {Math.round(metrics.renderTime)} ms</span>
      <span className="pill">Data: {Math.round(metrics.dataProcessingTime)} ms</span>
    </div>
  );
}


