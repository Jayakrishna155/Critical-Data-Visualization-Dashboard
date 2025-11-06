# Performance Dashboard (Next.js 14 + TypeScript)

High-performance real-time data visualization dashboard using Canvas + SVG hybrid rendering. No chart libraries.

## Setup

```bash
npm install
npm run dev
```

- Dev server: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard

## Features

- Real-time data stream (100ms) with sliding window
- Charts: Line, Bar, Scatter, Heatmap (canvas) + minimalist SVG/axes via canvas
- Controls: category filter, time range, aggregation (raw/1m/5m/1h)
- Virtualized table for large datasets
- FPS & memory monitor
- API route for batches (edge runtime)

## Performance

- Canvas rendering with HiDPI support and minimal allocations
- requestAnimationFrame loop with resize-aware re-render
- Memoized derivations and selective updates via context
- Virtualization for table

See PERFORMANCE.md for detailed benchmarks and techniques.

## Next.js App Router Usage

- `app/dashboard/page.tsx`: Server Component provides initial dataset
- Client components for interactive charts and controls
- Edge route handler in `app/api/data/route.ts`
- Static streaming for initial view (`dynamic = 'force-static'`)

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – start production server

## Browser Compatibility

- Latest Chrome/Edge/Firefox/Safari
- Memory metrics require Chrome (Performance.memory API)

## Screenshots
<img width="1440" height="732" alt="Screenshot 2025-11-06 at 5 31 24 PM" src="https://github.com/user-attachments/assets/e51bc213-0e09-447e-8021-b654a9254b5b" />

<img width="1440" height="659" alt="Screenshot 2025-11-06 at 5 31 35 PM" src="https://github.com/user-attachments/assets/6407bab0-9c23-4533-ac40-00a3a39ba7cb" />



