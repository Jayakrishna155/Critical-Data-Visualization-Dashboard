export interface Size { width: number; height: number; }

export function setupHiDPICanvas(canvas: HTMLCanvasElement, size: Size): CanvasRenderingContext2D {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.max(1, Math.floor(size.width * dpr));
  canvas.height = Math.max(1, Math.floor(size.height * dpr));
  canvas.style.width = `${size.width}px`;
  canvas.style.height = `${size.height}px`;
  const ctx = canvas.getContext('2d', { alpha: false })!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  return ctx;
}

export function clearCanvas(ctx: CanvasRenderingContext2D, size: Size) {
  ctx.clearRect(0, 0, size.width, size.height);
}

export function drawAxes(
  ctx: CanvasRenderingContext2D,
  size: Size,
  opts: { margin: number; color: string }
) {
  const { margin, color } = opts;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 1;
  // X axis
  ctx.beginPath();
  ctx.moveTo(margin, size.height - margin);
  ctx.lineTo(size.width - margin, size.height - margin);
  ctx.stroke();
  // Y axis
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin, size.height - margin);
  ctx.stroke();
  ctx.restore();
}

export function computeMinMax(values: number[]): { min: number; max: number } {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!isFinite(min) || !isFinite(max)) return { min: 0, max: 1 };
  if (min === max) return { min, max: min + 1 };
  return { min, max };
}


