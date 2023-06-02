import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  ComponentProps,
  RefCallback,
} from 'react';
import { Rive, EventType } from '@rive-app/canvas';
import { UseRiveParameters, UseRiveOptions, RiveState } from '../types';
import useResizeCanvas from './useResizeCanvas';
import { getOptions } from '../utils';

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const [rive, setRive] = useState<Rive | null>(null);

  const isParamsLoaded = Boolean(riveParams);
  const options = getOptions(opts);

  /**
   * When the canvas/parent container resize, reset the Rive layout to match the
   * new (0, 0, canvas.width, canvas.height) bounds in the render loop
   */
  const onCanvasHasResized = useCallback(() => {
    if (rive) {
      rive.startRendering();
      rive.resizeToCanvas();
    }
  }, [rive]);

  // Watch the canvas parent container resize and size the canvas to match
  useResizeCanvas({
    riveLoaded: !!rive,
    canvasRef,
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
    [setCanvasRef, setContainerRef]
  );

  return {
    canvas: canvasRef.current,
    container: containerRef.current,
    setCanvasRef,
    setContainerRef,
    rive,
    RiveComponent: Component,
  };
}
