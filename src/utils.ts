import React, { useState, useEffect, useRef } from 'react';
import { Dimensions } from './types';

// There are polyfills for this, but they add hundreds of lines of code
class FakeResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function throttle(f: Function, delay: number) {
  let timer = 0;
  return function (this: Function, ...args: any) {
    clearTimeout(timer);
    timer = window.setTimeout(() => f.apply(this, args), delay);
  };
}

const MyResizeObserver = globalThis.ResizeObserver || FakeResizeObserver;
const hasResizeObserver = globalThis.ResizeObserver !== undefined;

const useResizeObserver = hasResizeObserver;
const useWindowListener = !useResizeObserver;

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

      if (useWindowListener) {
        // only pay attention to window size changes when we do not have the resizeObserver (IE only)
        handleResize();
        window.addEventListener('resize', handleResize);
      }

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  const observer = useRef(
    new MyResizeObserver(
      throttle((entries: any) => {
        if (useResizeObserver) {
          setSize({
            width: entries[entries.length - 1].contentRect.width,
            height: entries[entries.length - 1].contentRect.height,
          });
        }
      }, 0)
    )
  );

  useEffect(() => {
    const current = observer.current;
    if (containerRef.current && useResizeObserver) {
      current.observe(containerRef.current);
    }

    return () => {
      current.disconnect();
      if (containerRef.current && useResizeObserver) {
        current.unobserve(containerRef.current);
      }
    };
  }, [containerRef, observer]);

  return size;
}
