import React, { useState, useEffect, useRef } from 'react';
import { Dimensions } from './types';
import ResizeObserver from 'resize-observer-polyfill';

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

      if (isIE()) {
        // only listen to window when its IE, as ResizeObserver will be polyfilled.
        window.addEventListener('resize', handleResize);
        handleResize();
      }
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const observer = useRef(
    new ResizeObserver((entries) => {
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

// grabbed from: https://stackoverflow.com/questions/19999388/check-if-user-is-using-ie
// There is a shorter version, but that one ran into type issues with typescript.
export function isIE() {
  /**
   * detect IEEdge
   * returns version of IE/Edge or false, if browser is not a Microsoft browser
   */
  const ua = window.navigator.userAgent;

  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  const edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}
