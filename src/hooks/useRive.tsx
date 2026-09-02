import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  ComponentProps,
  RefCallback,
} from 'react';
import { Rive, EventType, Fit } from '@rive-app/canvas';
import { UseRiveParameters, UseRiveOptions, RiveState } from '../types';
import useResizeCanvas from './useResizeCanvas';
import useDevicePixelRatio from './useDevicePixelRatio';
import { defaultOptions, getOptions, safeCleanup } from '../utils';
import useIntersectionObserver from './useIntersectionObserver';

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
  const [canvasElem, setCanvasElem] = useState<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const riveRef = useRef<Rive | null>(null);

  const [rive, setRive] = useState<Rive | null>(null);

  const isParamsLoaded = Boolean(riveParams);
  const options = getOptions(opts);

  /**
   * GPU Canvas records into a deferred session bound to ONE canvas. The
   * offscreen renderer is the opposite: it shares a single GL context across
   * every `<canvas>` on the page. Hand the JS runtime both and it warns, re-imports the file in
   * immediate mode, and GPU Canvas content silently never draws.
   *
   * The JS runtime's own default for `useOffscreenRenderer` is `false`; the `true`
   * is React runtime's (see `defaultOptions`). So opting into GPU Canvas only has
   * to unwind React's default — an explicit value from the caller still wins, and
   * still loses GPU Canvas, which the effect below warns about.
   */
  const explicitOffscreenRenderer =
    riveParams?.useOffscreenRenderer ?? opts.useOffscreenRenderer;

  // A file's rendering mode is fixed at import and wins over the instance's own
  // flag, so a `riveFile` built with `enableGPUCanvas: true` needs a
  // non-offscreen renderer even when `useRive` was never told about it.
  // `deferredRequested` is marked `@internal` on the runtime's RiveFile.
  const wantsGPUCanvas =
    Boolean(riveParams?.enableGPUCanvas) ||
    Boolean(riveParams?.riveFile?.deferredRequested);

  const useOffscreenRenderer =
    explicitOffscreenRenderer ??
    (wantsGPUCanvas ? false : defaultOptions.useOffscreenRenderer);

  // The runtime warns about this too, but from where it sits it cannot say that
  // a hook option is what turned the offscreen renderer on.
  useEffect(() => {
    if (wantsGPUCanvas && useOffscreenRenderer) {
      console.warn(
        '[Rive] GPU Canvas and `useOffscreenRenderer` cannot both be on. ' +
          'A GPU Canvas session records for a single <canvas>, while the offscreen ' +
          'renderer shares one context across every <canvas> on the page. This ' +
          'instance falls back to immediate rendering and GPU Canvas content will ' +
          'not draw — drop the explicit `useOffscreenRenderer: true` to use it.'
      );
    }
  }, [wantsGPUCanvas, useOffscreenRenderer]);

  const devicePixelRatio = useDevicePixelRatio();

  /**
   * When the canvas/parent container resize, reset the Rive layout to match the
   * new (0, 0, canvas.width, canvas.height) bounds in the render loop
   */
  const onCanvasHasResized = useCallback(() => {
    if (rive) {
      if (rive.layout && rive.layout.fit === Fit.Layout) {
        if (canvasElem) {
          const resizeFactor = devicePixelRatio * rive.layout.layoutScaleFactor;
          rive.devicePixelRatioUsed = devicePixelRatio;
          rive.artboardWidth = canvasElem?.width / resizeFactor;
          rive.artboardHeight = canvasElem?.height / resizeFactor;
        }
      }

      rive.startRendering();
      rive.resizeToCanvas();
    }
  }, [rive, devicePixelRatio]);

  // Watch the canvas parent container resize and size the canvas to match
  useResizeCanvas({
    riveLoaded: !!rive,
    canvasElem,
    containerRef,
    options,
    onCanvasHasResized,
    artboardBounds: rive?.bounds,
  });

  /**
   * Ref callback called when the canvas element mounts and unmounts.
   */
  const setCanvasRef: RefCallback<HTMLCanvasElement> = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      if (canvas === null && canvasElem) {
        canvasElem.height = 0;
        canvasElem.width = 0;
      }

      setCanvasElem(canvas);
    },
    []
  );

  useEffect(() => {
    if (!canvasElem || !riveParams) {
      return;
    }
    let isLoaded = rive != null;
    let r: Rive | null;
    if (rive == null) {
      const { onRiveReady, ...restRiveParams } = riveParams;
      r = new Rive({
        ...restRiveParams,
        useOffscreenRenderer,
        canvas: canvasElem,
      });
      if (riveRef.current != null) {
        safeCleanup('replacing a previous instance', () =>
          riveRef.current!.cleanup()
        );
      }
      riveRef.current = r;
      r.on(EventType.Load, () => {
        isLoaded = true;

        if (onRiveReady) {
          onRiveReady(r!);
        }

        // Check if the component/canvas is mounted before setting state to avoid setState
        // on an unmounted component in some rare cases
        if (canvasElem) {
          setRive(r);
        } else {
          // If unmounted, cleanup the rive object immediately
          safeCleanup('unmounted before load', () => r!.cleanup());
        }
      });
    }
    return () => {
      if (!isLoaded) {
        safeCleanup('teardown before load', () => r?.cleanup());
      }
    };
  }, [canvasElem, isParamsLoaded, rive]);
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
  const { observe, unobserve } = useIntersectionObserver();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let isPaused = false;
    // This is a workaround to retest whether an element is offscreen or not.
    // There seems to be a bug in Chrome that triggers an intersection change when an element
    // is moved within the DOM using insertBefore.
    // For some reason, when this is called whithin the context of a React application, the
    // intersection callback is called only once reporting isIntersecting as false but never
    // triggered back with isIntersecting as true.
    // For this reason we retest after 10 millisecond whether the element is actually off the
    // viewport or not.
    const retestIntersection = () => {
      if (canvasElem && isPaused) {
        const size = canvasElem.getBoundingClientRect();
        const isIntersecting =
          size.width > 0 &&
          size.height > 0 &&
          size.top <
            (window.innerHeight || document.documentElement.clientHeight) &&
          size.bottom > 0 &&
          size.left <
            (window.innerWidth || document.documentElement.clientWidth) &&
          size.right > 0;
        if (isIntersecting) {
          rive?.startRendering();
          isPaused = false;
        }
      }
    };
    const onChange = (entry: IntersectionObserverEntry) => {
      entry.isIntersecting
        ? rive && rive.startRendering()
        : rive && rive.stopRendering();
      isPaused = !entry.isIntersecting;
      clearTimeout(timeoutId);
      if (!entry.isIntersecting && entry.boundingClientRect.width === 0) {
        timeoutId = setTimeout(retestIntersection, 10);
      }
    };
    if (canvasElem && options.shouldUseIntersectionObserver !== false) {
      observe(canvasElem, onChange);
    }
    return () => {
      if (canvasElem) {
        unobserve(canvasElem);
      }
    };
  }, [
    observe,
    unobserve,
    rive,
    canvasElem,
    options.shouldUseIntersectionObserver,
  ]);

  /**
   * On unmount, call cleanup to cleanup any WASM generated objects that need
   * to be manually destroyed.
   */
  useEffect(() => {
    return () => {
      if (rive) {
        // setRive(null) runs either way — a half-destroyed instance is unusable.
        safeCleanup('unmount', () => rive.cleanup());
        setRive(null);
      }
    };
  }, [rive, canvasElem]);

  useEffect(() => {
    return () => {
      if (riveRef.current != null) {
        safeCleanup('final unmount', () => riveRef.current!.cleanup());
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
    [setCanvasRef, setContainerRef]
  );

  return {
    canvas: canvasElem,
    container: containerRef.current,
    setCanvasRef,
    setContainerRef,
    rive,
    RiveComponent: Component,
  };
}
