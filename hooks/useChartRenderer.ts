'use client';

import { useCallback, useEffect, useRef } from 'react';
import { clearCanvas, computeMinMax, drawAxes, setupHiDPICanvas } from '@/lib/canvasUtils';

export interface ChartRenderOpts {
  series: { x: number[]; y: number[]; color: string }[];
  height: number;
  margin?: number;
  kind: 'line' | 'bar' | 'scatter' | 'heatmap';
}

export function useChartRenderer(canvasRef: React.RefObject<HTMLCanvasElement>, opts: ChartRenderOpts) {
  const { series, height, margin = 28, kind } = opts;
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth || canvas.parentElement?.clientWidth || 600;
    const heightPx = height;
    const ctx = setupHiDPICanvas(canvas, { width, height: heightPx });
    sizeRef.current = { w: width, h: heightPx };
    clearCanvas(ctx, { width, height: heightPx });
    drawAxes(ctx, { width, height: heightPx }, { margin, color: 'rgba(255,255,255,0.35)' });

    // Compute x/y ranges
    const allX: number[] = [];
    const allY: number[] = [];
    for (const s of series) {
      if (s.x.length && s.y.length) {
        allX.push(s.x[0], s.x[s.x.length - 1]);
        allY.push(...s.y);
      }
    }
    const { min: minY, max: maxY } = computeMinMax(allY);
    const { min: minX, max: maxX } = computeMinMax(allX);

    const innerW = width - margin * 2;
    const innerH = heightPx - margin * 2;
    const xToPx = (x: number) => margin + ((x - minX) / (maxX - minX)) * innerW;
    const yToPx = (y: number) => heightPx - margin - ((y - minY) / (maxY - minY)) * innerH;

    ctx.save();
    for (const s of series) {
      ctx.strokeStyle = s.color;
      ctx.fillStyle = s.color;
      if (kind === 'line') {
        ctx.beginPath();
        for (let i = 0; i < s.x.length; i++) {
          const px = xToPx(s.x[i]);
          const py = yToPx(s.y[i]);
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.9;
        ctx.stroke();
      } else if (kind === 'bar') {
        const barW = Math.max(1, innerW / Math.max(1, s.x.length));
        ctx.globalAlpha = 0.9;
        for (let i = 0; i < s.x.length; i++) {
          const px = xToPx(s.x[i]);
          const py = yToPx(s.y[i]);
          const h = heightPx - margin - py;
          ctx.fillRect(px - barW * 0.5, py, barW * 0.9, h);
        }
      } else if (kind === 'scatter') {
        ctx.globalAlpha = 0.85;
        for (let i = 0; i < s.x.length; i++) {
          const px = xToPx(s.x[i]);
          const py = yToPx(s.y[i]);
          ctx.beginPath();
          ctx.arc(px, py, 1.75, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (kind === 'heatmap') {
        // simple coarse-grained binning
        const binsX = 64;
        const binsY = 40;
        const bin: number[][] = Array.from({ length: binsY }, () => Array(binsX).fill(0));
        for (let i = 0; i < s.x.length; i++) {
          const bx = Math.min(binsX - 1, Math.max(0, Math.floor(((s.x[i] - minX) / (maxX - minX)) * binsX)));
          const by = Math.min(binsY - 1, Math.max(0, Math.floor(((s.y[i] - minY) / (maxY - minY)) * binsY)));
          bin[by][bx] += 1;
        }
        const maxBin = bin.reduce((m, row) => Math.max(m, ...row), 1);
        for (let by = 0; by < binsY; by++) {
          for (let bx = 0; bx < binsX; bx++) {
            const intensity = bin[by][bx] / maxBin;
            if (intensity <= 0) continue;
            const x = margin + (bx / binsX) * innerW;
            const y = margin + (by / binsY) * innerH;
            const w = innerW / binsX + 1;
            const h = innerH / binsY + 1;
            ctx.fillStyle = `rgba(96,165,250,${Math.min(1, intensity)})`;
            ctx.fillRect(x, heightPx - y - h, w, h);
          }
        }
      }
    }
    ctx.restore();
  }, [canvasRef, series, height, margin, kind]);

  useEffect(() => {
    render();
    const obs = new ResizeObserver(() => render());
    const el = canvasRef.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, [render]);

  return { rerender: render, sizeRef };
}


