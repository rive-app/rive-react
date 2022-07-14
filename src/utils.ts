import React, { useState, useEffect, useRef } from 'react';
import { Dimensions } from './types';

// There are polyfills for this, but they add hundreds of lines of code
class FakeResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const MyResizeObserver = globalThis.ResizeObserver || FakeResizeObserver;
const hasResizeObserver = globalThis.ResizeObserver !== undefined;

export function useSize(
  containerRef: React.MutableRefObject<HTMLElement | null>
) {
  const [size, setSize] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  // internet explorer does not support ResizeObservers.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      if (!hasResizeObserver) {
        // only pay attention to window size changes when we do not have the resizeObserver (IE only)
        window.addEventListener('resize', handleResize);
        handleResize();
      }
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const observer = useRef(
    new MyResizeObserver((entries) => {
      setSize({
        width: entries[entries.length - 1].contentRect.width,
        height: entries[entries.length - 1].contentRect.height,
      });
    })
  );

  useEffect(() => {
    const current = observer.current;
    if (containerRef.current) {
      current.observe(containerRef.current);
    }

    return () => {
      current.disconnect();
    };
  }, [containerRef, observer]);

  return size;
}
