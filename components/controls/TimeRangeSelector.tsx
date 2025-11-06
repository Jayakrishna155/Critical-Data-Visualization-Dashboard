'use client';

import React from 'react';
import { useDataContext } from '@/components/providers/DataProvider';

export default function TimeRangeSelector() {
  const { state, setAggregation, setTimeRangeMs } = useDataContext();
  return (
    <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
      <select
        className="pill"
        value={state.aggregation}
        onChange={(e) => setAggregation(e.target.value as any)}
      >
        <option value="raw">Raw</option>
        <option value="1m">1m</option>
        <option value="5m">5m</option>
        <option value="1h">1h</option>
      </select>
      <select
        className="pill"
        value={state.timeRangeMs}
        onChange={(e) => setTimeRangeMs(Number(e.target.value))}
      >
        <option value={5 * 60_000}>Last 5m</option>
        <option value={15 * 60_000}>Last 15m</option>
        <option value={60 * 60_000}>Last 1h</option>
        <option value={3 * 60 * 60_000}>Last 3h</option>
      </select>
    </div>
  );
}


