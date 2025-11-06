'use client';

import React from 'react';
import { useDataContext } from '@/components/providers/DataProvider';

export default function FilterPanel() {
  const { state, toggleCategory } = useDataContext();
  return (
    <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
      {state.categories.map((c) => {
        const active = state.selectedCategories.has(c);
        return (
          <button key={c} className="button ghost" onClick={() => toggleCategory(c)} style={{ borderColor: active ? 'var(--accent)' : undefined }}>
            {active ? '✓ ' : ''}{c}
          </button>
        );
      })}
    </div>
  );
}


