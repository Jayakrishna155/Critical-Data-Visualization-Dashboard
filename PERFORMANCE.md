# PERFORMANCE.md

## Benchmarking Results

- Target: 10,000+ points at 60 FPS
- Observed (Dev, MBP M1): 60 FPS sustained with 10–20k points; ~35–45 FPS at 50k
- Memory: stable; sliding window + capped history; Chrome memory API shows steady usage after warmup

## React Optimization Techniques

- Context provides raw + derived series; expensive work memoized
- `useChartRenderer` performs rendering directly to Canvas with minimal allocations
- `useMemo` and derived windows/aggregations reduce churn
- Virtualized table avoids large DOM nodes
- `ResizeObserver` triggers precise re-renders on container changes

## Next.js Performance Features

- Server Component for initial dataset (zero JS cost on server work)
- Edge Route for data batches; lightweight JSON
- Static rendering of shell; client hydration for interactivity

## Canvas Integration

- HiDPI canvas sizing with devicePixelRatio transform
- requestAnimationFrame loop renders only when data or size changes
- Minimal state in React; imperative canvas drawing for per-frame work
- Level of detail: heatmap bins for dense scatter

## Scaling Strategy

- Aggregation windows (`raw`, `1m`, `5m`, `1h`) reduce point count visually
- Sliding time window and max history protect memory
- Optional Web Worker/OffscreenCanvas can offload processing if needed

## Stress Test Mode (how to run)

- Increase time window to 3h and set aggregation to raw
- Open Performance monitor to observe FPS and memory
- Interact (zoom/pan todo) to validate <100ms latency


