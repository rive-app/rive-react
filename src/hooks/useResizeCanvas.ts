import { useEffect, useState, MutableRefObject, useCallback } from 'react';
import { Bounds } from '@rive-app/canvas';
import { Dimensions, UseRiveOptions } from '../types';
import useDevicePixelRatio from './useDevicePixelRatio';
import useContainerSize from './useContainerSize';
import { getOptions } from '../utils';

interface UseResizeCanvasProps {
  riveLoaded: boolean;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  containerRef: MutableRefObject<HTMLElement | null>;
  onCanvasHasResized?: () => void;
  options?: Partial<UseRiveOptions>;
  artboardBounds?: Bounds;
}

/**
 * Helper hook to listen for changes in the <canvas> parent container size and size the <canvas>
 * to match. If a resize event has occurred, a supplied callback (onCanvasHasResized)
 * will be inokved to allow for any re-calculation needed (i.e. Rive layout on the canvas).
 *
 * This hook is useful if you are not intending to use the `useRive` hook yourself, but still
 * want to use the auto-sizing logic on the canvas/container.
 *
 * @param props - Object to supply necessary
 */
export default function useResizeCanvas({
  riveLoaded = false,
  canvasRef,
  containerRef,
  options = {},
  onCanvasHasResized,
  artboardBounds,
}: UseResizeCanvasProps) {
  const presetOptions = getOptions(options);
  const [
    { height: lastContainerHeight, width: lastContainerWidth },
    setLastContainerDimensions,
  ] = useState<Dimensions>({
    height: 0,
    width: 0,
  });
  const [
    { height: lastCanvasHeight, width: lastCanvasWidth },
    setLastCanvasSize,
  ] = useState<Dimensions>({
    height: 0,
    width: 0,
  });

  const [isFirstSizing, setIsFirstSizing] = useState(true);

  const {
    fitCanvasToArtboardHeight,
    shouldResizeCanvasToContainer,
    useDevicePixelRatio: shouldUseDevicePixelRatio,
  } = presetOptions;

  const containerSize = useContainerSize(
    containerRef,
    shouldResizeCanvasToContainer
  );
  const currentDevicePixelRatio = useDevicePixelRatio();

  const { maxX, maxY } = artboardBounds ?? {};

  const getCanvasDimensions = useCallback(() => {
    const width = containerRef.current?.clientWidth ?? 0;
    const height = containerRef.current?.clientHeight ?? 0;
    if (fitCanvasToArtboardHeight && artboardBounds) {
      const { maxY, maxX } = artboardBounds;
      return { width, height: width * (maxY / maxX) };
    }
    return {
      width,
      height,
    };
  }, [containerRef, fitCanvasToArtboardHeight, maxX, maxY]);

  useEffect(() => {
    if (
      !shouldResizeCanvasToContainer ||
      !containerRef.current ||
      !riveLoaded
    ) {
      return;
    }

    const { width, height } = getCanvasDimensions();
    let hasResized = false;
    if (canvasRef.current) {
      // Check if the canvas parent container bounds have changed and set
      // new values accordingly
      const boundsChanged =
        width !== lastContainerWidth || height !== lastContainerHeight;
      if (presetOptions.fitCanvasToArtboardHeight && boundsChanged) {
        containerRef.current.style.height = height + 'px';
        hasResized = true;
      }
      if (presetOptions.useDevicePixelRatio) {
        // Check if devicePixelRatio may have changed and get new canvas
        // width/height values to set the size
        const canvasSizeChanged =
          width * currentDevicePixelRatio !== lastCanvasWidth ||
          height * currentDevicePixelRatio !== lastCanvasHeight;
        if (boundsChanged || canvasSizeChanged) {
          const newCanvasWidthProp = currentDevicePixelRatio * width;
          const newCanvasHeightProp = currentDevicePixelRatio * height;
          canvasRef.current.width = newCanvasWidthProp;
          canvasRef.current.height = newCanvasHeightProp;
          canvasRef.current.style.width = width + 'px';
          canvasRef.current.style.height = height + 'px';
          setLastCanvasSize({
            width: newCanvasWidthProp,
            height: newCanvasHeightProp,
          });
          hasResized = true;
        }
      } else if (boundsChanged) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        setLastCanvasSize({
          width: width,
          height: height,
        });
        hasResized = true;
      }
      setLastContainerDimensions({ width, height });
    }

    // Callback to perform any Rive-related actions after resizing the canvas
    // (i.e., reset the Rive layout in the render loop)
    if (onCanvasHasResized && (isFirstSizing || hasResized)) {
      onCanvasHasResized && onCanvasHasResized();
    }
    isFirstSizing && setIsFirstSizing(false);
  }, [
    canvasRef,
    containerRef,
    containerSize,
    currentDevicePixelRatio,
    getCanvasDimensions,
    isFirstSizing,
    setIsFirstSizing,
    lastCanvasHeight,
    lastCanvasWidth,
    lastContainerHeight,
    lastContainerWidth,
    onCanvasHasResized,
    shouldResizeCanvasToContainer,
    fitCanvasToArtboardHeight,
    shouldUseDevicePixelRatio,
    riveLoaded,
  ]);
}
