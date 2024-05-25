import { useCallback } from 'react';
import ElementObserver from './elementObserver';

let observer: ElementObserver;
const getObserver = () => {
  if(!observer) {
    observer = new ElementObserver();
  }
  return observer;
}

/**
 * Hook to listen for a ref element's resize events being triggered. When resized,
 * it sets state to an object of {width: number, height: number} indicating the contentRect
 * size of the element at the new resize.
 *
 * @param containerRef - Ref element to listen for resize events on
 * @returns - Size object with width and height attributes
 */
export default function useIntersectionObserver() {
  const observe = useCallback((element: Element, callback: Function) => {
    const observer = getObserver();
    observer.registerCallback(element, callback);
  }, []);

  const unobserve = useCallback((element: Element) => {
    const observer = getObserver();
    observer.removeCallback(element);
  }, []);

  return {
    observe,
    unobserve,
  };
}
