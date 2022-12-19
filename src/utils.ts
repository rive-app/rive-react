import React, { useState, useEffect, useRef } from 'react';
import { Dimensions } from './types';

// There are polyfills for this, but they add hundreds of lines of code
class FakeResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
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

/**
 * Listen for devicePixelRatio changes and set the new value accordingly. This could
 * happen for reasons such as:
 * - User moves window from retina screen display to a separate monitor
 * - User controls zoom settings on the browser
 *
 * Source: https://github.com/rexxars/use-device-pixel-ratio/blob/main/index.ts
 *
 * @returns dpr: Number - Device pixel ratio; ratio of physical px to resolution in CSS pixels for current device
 */
export function useDevicePixelRatio() {
  const dpr = getDevicePixelRatio();
  const [currentDpr, setCurrentDpr] = useState(dpr);

  useEffect(() => {
    const canListen = typeof window !== 'undefined' && 'matchMedia' in window;
    if (!canListen) {
      return;
    }

    const updateDpr = () => {
      const newDpr = getDevicePixelRatio();
      setCurrentDpr(newDpr);
    };
    const mediaMatcher = window.matchMedia(
      `screen and (resolution: ${currentDpr}dppx)`
    );
    mediaMatcher.hasOwnProperty('addEventListener')
      ? mediaMatcher.addEventListener('change', updateDpr)
      : mediaMatcher.addListener(updateDpr);

    return () => {
      mediaMatcher.hasOwnProperty('removeEventListener')
        ? mediaMatcher.removeEventListener('change', updateDpr)
        : mediaMatcher.removeListener(updateDpr);
    };
  }, [currentDpr]);

  return currentDpr;
}

export function getDevicePixelRatio(): number {
  const hasDprProp =
    typeof window !== 'undefined' &&
    typeof window.devicePixelRatio === 'number';
  const dpr = hasDprProp ? window.devicePixelRatio : 1;
  return Math.min(Math.max(1, dpr), 3);
}
