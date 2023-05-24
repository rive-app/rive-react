import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  ComponentProps,
  RefCallback,
} from 'react';
import { Rive, EventType } from '@rive-app/canvas';
import {
  UseRiveParameters,
  UseRiveOptions,
  RiveState,
  Dimensions,
} from '../types';
import { useSize, useDevicePixelRatio } from '../utils';

type RiveComponentProps = {
  setContainerRef: RefCallback<HTMLElement>;
  setCanvasRef: RefCallback<HTMLCanvasElement>;
};

function RiveComponent({
  setContainerRef,
  setCanvasRef,
  className = '',
  style,
  children,
  ...rest
}: RiveComponentProps & ComponentProps<'canvas'>) {
  const containerStyle = {
    width: '100%',
    height: '100%',
    ...style,
  };

  return (
    <div
      ref={setContainerRef}
      className={className}
      {...(!className && { style: containerStyle })}
    >
      <canvas
        ref={setCanvasRef}
        style={{ verticalAlign: 'top', width: 0, height: 0 }}
        {...rest}
      >
        {children}
      </canvas>
    </div>
  );
}

const defaultOptions = {
  useDevicePixelRatio: true,
  fitCanvasToArtboardHeight: false,
  useOffscreenRenderer: true,
};

/**
 * Returns options, with defaults set.
 *
 * @param opts
 * @returns
 */
function getOptions(opts: Partial<UseRiveOptions>) {
  return Object.assign({}, defaultOptions, opts);
}

/**
 * Custom Hook for loading a Rive file.
 *
 * Waits until the load event has fired before returning it.
 * We can then listen for changes to this animation in other hooks to detect
 * when it has loaded.
 *
 * @param riveParams - Object containing parameters accepted by the Rive object
 *   in the rive-js runtime, with the exception of Canvas as that is attached
 *   via the ref callback `setCanvasRef`.
 *
 * @param opts - Optional list of options that are specific for this hook.
 * @returns {RiveAnimationState}
 */
export default function useRive(
  riveParams?: UseRiveParameters,
  opts: Partial<UseRiveOptions> = {}
): RiveState {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const [rive, setRive] = useState<Rive | null>(null);
  const [lastContainerDimensions, setLastContainerDimensions] =
    useState<Dimensions>({
      height: 0,
      width: 0,
    });
  const [lastCanvasSize, setLastCanvasSize] = useState<Dimensions>({
    height: 0,
    width: 0,
  });

  // Listen to changes in the window sizes and update the bounds when changes
  // occur.
  const size = useSize(containerRef);
  const currentDevicePixelRatio = useDevicePixelRatio();

  const isParamsLoaded = Boolean(riveParams);
  const options = getOptions(opts);

  /**
   * Gets the intended dimensions of the canvas element.
   *
   * The intended dimensions are those of the container element, unless the
   * option `fitCanvasToArtboardHeight` is true, then they are adjusted to
   * the height of the artboard.
   *
   * @returns Dimensions object.
   */
  function getCanvasDimensions() {
    // getBoundingClientRect returns the scaled width and height
    // this will result in double scaling
    // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements

    const width = containerRef.current?.clientWidth ?? 0;
    const height = containerRef.current?.clientHeight ?? 0;

    if (rive && options.fitCanvasToArtboardHeight) {
      const { maxY, maxX } = rive.bounds;
      return { width, height: width * (maxY / maxX) };
    }
    return { width, height };
  }

  /**
   * Updates the width and height of the canvas.
   */
  function updateBounds() {
    if (!containerRef.current) {
      return;
    }

    const { width, height } = getCanvasDimensions();
    if (canvasRef.current && rive) {
      // Check if the canvas parent container bounds have changed and set
      // new values accordingly
      const boundsChanged =
        width !== lastContainerDimensions.width ||
        height !== lastContainerDimensions.height;
      if (options.fitCanvasToArtboardHeight && boundsChanged) {
        containerRef.current.style.height = height + 'px';
      }
      if (options.useDevicePixelRatio) {
        // Check if devicePixelRatio may have changed and get new canvas
        // width/height values to set the size
        const canvasSizeChanged =
          width * currentDevicePixelRatio !== lastCanvasSize.width ||
          height * currentDevicePixelRatio !== lastCanvasSize.height;
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
        }
      } else if (boundsChanged) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        setLastCanvasSize({
          width: width,
          height: height,
        });
      }
      setLastContainerDimensions({ width, height });

      // Updating the canvas width or height will clear the canvas, so call
      // startRendering() to redraw the current frame as the animation might
      // be paused and not advancing.
      rive.startRendering();
    }

    // Always resize to Canvas
    if (rive) {
      rive.resizeToCanvas();
    }
  }

  /**
   * Listen to changes on the windowSize and the rive file being loaded
   * and update the canvas bounds as needed.
   *
   * ie does not support ResizeObservers, so we fallback to the window listener there
   */
  useEffect(() => {
    if (rive) {
      updateBounds();
    }
  }, [rive, size, currentDevicePixelRatio]);

  /**
   * Ref callback called when the canvas element mounts and unmounts.
   */
  const setCanvasRef: RefCallback<HTMLCanvasElement> = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (canvas && riveParams && isParamsLoaded) {
        const { useOffscreenRenderer } = options;
        const r = new Rive({
          useOffscreenRenderer,
          ...riveParams,
          canvas,
        });
        r.on(EventType.Load, () => {
          // Check if the component/canvas is mounted before setting state to avoid setState
          // on an unmounted component in some rare cases
          if (canvasRef.current) {
            setRive(r);
          } else {
            // If unmounted, cleanup the rive object immediately
            r.cleanup();
          }
        });
      } else if (canvas === null && canvasRef.current) {
        canvasRef.current.height = 0;
        canvasRef.current.width = 0;
      }

      canvasRef.current = canvas;
    },
    [isParamsLoaded]
  );
  /**
   * Ref callback called when the container element mounts
   */
  const setContainerRef: RefCallback<HTMLElement> = useCallback(
    (container: HTMLElement | null) => {
      containerRef.current = container;
    },
    []
  );

  /**
   * Set up IntersectionObserver to stop rendering if the animation is not in
   * view.
   */
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      entry.isIntersecting
        ? rive && rive.startRendering()
        : rive && rive.stopRendering();
    });

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rive]);

  /**
   * On unmount, call cleanup to cleanup any WASM generated objects that need
   * to be manually destroyed.
   */
  useEffect(() => {
    return () => {
      if (rive) {
        rive.cleanup();
        setRive(null);
      }
    };
  }, [rive]);

  /**
   * Listen for changes in the animations params
   */
  const animations = riveParams?.animations;
  useEffect(() => {
    if (rive && animations) {
      if (rive.isPlaying) {
        rive.stop(rive.animationNames);
        rive.play(animations);
      } else if (rive.isPaused) {
        rive.stop(rive.animationNames);
        rive.pause(animations);
      }
    }
  }, [animations, rive]);

  const Component = useCallback(
    (props: ComponentProps<'canvas'>): JSX.Element => {
      return (
        <RiveComponent
          setContainerRef={setContainerRef}
          setCanvasRef={setCanvasRef}
          {...props}
        />
      );
    },
    []
  );

  return {
    canvas: canvasRef.current,
    setCanvasRef,
    setContainerRef,
    rive,
    RiveComponent: Component,
  };
}
