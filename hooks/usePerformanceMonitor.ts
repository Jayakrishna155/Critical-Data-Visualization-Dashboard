'use client';

import { useEffect, useRef, useState } from 'react';
import { PerformanceMetrics } from '@/lib/types';

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ fps: 0, memoryUsage: null, renderTime: 0, dataProcessingTime: 0 });
  const framesRef = useRef(0);
  const lastRef = useRef(performance.now());
  const rafRef = useRef(0);

  useEffect(() => {
    const loop = () => {
      framesRef.current += 1;
      const now = performance.now();
      const dt = now - lastRef.current;
      if (dt >= 1000) {
        const fps = Math.round((framesRef.current * 1000) / dt);
        framesRef.current = 0;
        lastRef.current = now;
        const mem = (performance as any).memory?.usedJSHeapSize ?? null;
        setMetrics((m) => ({ ...m, fps, memoryUsage: mem }));
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const setRenderTime = (renderTime: number) => setMetrics((m) => ({ ...m, renderTime }));
  const setDataProcessingTime = (dataProcessingTime: number) => setMetrics((m) => ({ ...m, dataProcessingTime }));

  return { metrics, setRenderTime, setDataProcessingTime };
}


