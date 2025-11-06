'use client';

import React, { useMemo } from 'react';
import { useDataContext } from '@/components/providers/DataProvider';
import { useVirtualization } from '@/hooks/useVirtualization';

const ROW_HEIGHT = 28;
const VIEWPORT_HEIGHT = 300;

export default function DataTable() {
  const { dataWindow } = useDataContext();
  const rows = useMemo(() => dataWindow.slice(-10_000).reverse(), [dataWindow]);
  const { containerRef, onScroll, totalHeight, offsetTop, items } = useVirtualization(rows, ROW_HEIGHT, VIEWPORT_HEIGHT);

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{ height: VIEWPORT_HEIGHT, overflow: 'auto', position: 'relative', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, marginTop: 8 }}
    >
      <div style={{ height: totalHeight }} />
      <table style={{ position: 'absolute', top: offsetTop, left: 0, width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ position: 'sticky', top: 0 }}>
            <th className="muted" style={{ textAlign: 'left', padding: '4px 8px' }}>Timestamp</th>
            <th className="muted" style={{ textAlign: 'left', padding: '4px 8px' }}>Value</th>
            <th className="muted" style={{ textAlign: 'left', padding: '4px 8px' }}>Category</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d, i) => (
            <tr key={i} style={{ height: ROW_HEIGHT, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '4px 8px' }}>{new Date(d.timestamp).toISOString().slice(11, 19)}</td>
              <td style={{ padding: '4px 8px', color: '#6ee7b7' }}>{d.value.toFixed(2)}</td>
              <td style={{ padding: '4px 8px' }}>{d.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


