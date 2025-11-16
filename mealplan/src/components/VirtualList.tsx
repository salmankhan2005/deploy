import { memo, useMemo, useRef } from 'react';
import { useVirtualization } from '@/hooks/useVirtualization';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
  className?: string;
  getItemKey?: (item: T, index: number) => string | number;
}

export const VirtualList = memo(<T,>({ 
  items, 
  renderItem, 
  itemHeight = 80, 
  containerHeight = 400,
  className = "",
  getItemKey = (_, index) => index
}: VirtualListProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { visibleItems, totalHeight, offsetY, handleScroll } = useVirtualization({
    items,
    itemHeight,
    containerHeight
  });

  const memoizedItems = useMemo(() => 
    visibleItems.map(({ item, index }) => (
      <div 
        key={getItemKey(item, index)} 
        style={{ 
          height: itemHeight,
          position: 'absolute',
          top: index * itemHeight,
          width: '100%'
        }}
      >
        {renderItem(item, index)}
      </div>
    )), 
    [visibleItems, itemHeight, renderItem, getItemKey]
  );

  if (items.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className={`overflow-auto ${className}`} 
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {memoizedItems}
        </div>
      </div>
    </div>
  );
});