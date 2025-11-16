import { useState, useEffect, useMemo, useCallback } from 'react';

interface UseVirtualizationProps {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualization = ({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: UseVirtualizationProps) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + overscan, items.length);
    
    return {
      startIndex: Math.max(0, startIndex - overscan),
      endIndex,
      visibleCount
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index
    }));
  }, [items, visibleRange.startIndex, visibleRange.endIndex]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
};