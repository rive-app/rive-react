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
import { useSize } from '../utils';

type RiveComponentProps = {
  setContainerRef: RefCallback<HTMLElement>;
  setCanvasRef: RefCallback<HTMLCanvasElement>;
};

function RiveComponent({
  setContainerRef,
  setCanvasRef,
  className = '',
  style,
  width,
  height,
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
        style={{ verticalAlign: 'top' }}
        {...(width !== undefined && {width, 'data-rive-width-prop': width})}
        {...(height !== undefined && {height, 'data-c': height})}
        {...rest} />
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
  const riveRef = useRef<Rive | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
  });

  // Listen to changes in the window sizes and update the bounds when changes
  // occur.
  const size = useSize(containerRef);

  const isParamsLoaded = Boolean(riveParams);

  const artboardParam = riveParams?.artboard;

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
    const boundsChanged =
      width !== dimensions.width || height !== dimensions.height;
    if (canvasRef.current && rive && boundsChanged) {
      if (options.fitCanvasToArtboardHeight) {
        containerRef.current.style.height = height + 'px';
      }
      const widthProp = canvasRef.current.dataset['rive-width-prop'];
      const heightProp = canvasRef.current.dataset['rive-height-prop'];
      if (options.useDevicePixelRatio) {
        const dpr = window.devicePixelRatio || 1;
        if (!widthProp) {
          canvasRef.current.width = dpr * width;
        }
        if (!heightProp) {
          canvasRef.current.height = dpr * height;
        }
        canvasRef.current.style.width = width + 'px';
        canvasRef.current.style.height = height + 'px';
      } else {
        if (!widthProp) {
          canvasRef.current.width = width;
        }
        if (!heightProp) {
          canvasRef.current.height = height;
        }
      }
      setDimensions({ width, height });

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
  }, [rive, size]);

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
            // Setting a ref in addition to state so that we can get a reference to the Rive
            // instance on component unmount
            riveRef.current = r;
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
        ? rive && riveRef.current && rive.startRendering()
        : rive && riveRef.current && rive.stopRendering();
    });

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [rive]);

  /**
   * Reset Rive when the artboard, animations, or state machines change
   */
  useEffect(() => {
    // Ensure at least the artboard is set before resetting Rive
    if (artboardParam && rive) {
      rive.stopRendering();
      rive.stop();
      rive.cleanup();

      const { useOffscreenRenderer } = options;
      const r = new Rive({
        useOffscreenRenderer,
        ...riveParams,
        canvas: canvasRef.current as HTMLCanvasElement,
      });
      r.on(EventType.Load, () => {
        if (canvasRef.current) {
          setRive(r);
            // Setting a ref in addition to state so that we can get a reference to the Rive
            // instance on component unmount
          riveRef.current = r;
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artboardParam]);

  /**
   * On unmount, stop rive from rendering.
   */
  useEffect(() => {
    return () => {
      if (riveRef.current) {
        riveRef.current.stopRendering();
        riveRef.current.stop();
        riveRef.current.cleanup();
      }
    };
  }, []);

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
    [setCanvasRef, setContainerRef],
  );

  return {
    canvas: canvasRef.current,
    setCanvasRef,
    setContainerRef,
    rive,
    RiveComponent: Component,
  };
}
