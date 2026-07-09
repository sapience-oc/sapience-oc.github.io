import { useCallback, useRef, useState } from 'react';


export function useDraggableSheet({ maxHeight = 220, minHeight = 72 } = {}) {
  const [headerHeight, setHeaderHeight] = useState(maxHeight);
  const ticking = useRef(false);

  const handleScroll = useCallback(
    (e) => {
      const scrollTop = e.target.scrollTop;
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          const next = Math.max(minHeight, maxHeight - scrollTop);
          setHeaderHeight(next);
          ticking.current = false;
        });
      }
    },
    [maxHeight, minHeight]
  );

  const range = maxHeight - minHeight || 1;
  const progress = 1 - (headerHeight - minHeight) / range; // 0 = topo, 1 = totalmente encolhido

  return { headerHeight, progress, onScroll: handleScroll, maxHeight, minHeight };
}
