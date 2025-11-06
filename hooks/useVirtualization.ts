'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

export function useVirtualization<T>(items: T[], rowHeight: number, viewportHeight: number) {
  const [scrollTop, setScrollTop] = useState(0);
  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.target as HTMLDivElement).scrollTop);
  }, []);
  const totalHeight = items.length * rowHeight;
  const overscan = 8;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
  const endIndex = Math.min(items.length, startIndex + visibleCount);
  const offsetTop = startIndex * rowHeight;
  const slice = useMemo(() => items.slice(startIndex, endIndex), [items, startIndex, endIndex]);
  const containerRef = useRef<HTMLDivElement>(null);
  return { containerRef, onScroll, totalHeight, offsetTop, items: slice };
}


