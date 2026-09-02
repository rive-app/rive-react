import { Layout } from '@rive-app/canvas';
import React, { ComponentProps } from 'react';
import useRive from '../hooks/useRive';

export interface RiveProps {
  /**
   * URL of the Rive asset, or path to where the public asset is stored.
   */
  src: string;
  /**
   * Artboard to render from the Rive asset.
   * Defaults to the first artboard created.
   */
  artboard?: string;
  /**
   * Name of the state machine to play.
   */
  stateMachine?: string;
  /**
   * Specify a starting animation to play.
   *
   * @deprecated Use the `stateMachine` prop to play a state machine instead.
   * Support for starting playback with named animations will be removed in a
   * future major version. See
   * {@link https://rive.app/docs/editor/state-machine/state-machine} for more on
   * setting up state machines in your Rive file.
   */
  animations?: string | string[];
  /**
   * Specify a starting state machine to play.
   *
   * @deprecated Use `stateMachine` with a single state machine name instead.
   * Support for playing multiple state machines at once will be removed in a
   * future major version.
   */
  stateMachines?: string | string[];
  /**
   * Specify a starting Layout object to set Fill and Alignment for the drawing surface. See docs at https://rive.app/docs/runtimes/react/layouts for more on layout configuration.
   */
  layout?: Layout;
  /**
   * For `@rive-app/react-webgl2`, share one WebGL context across every canvas
   * on the page instead of giving this canvas its own.
   *
   * **We recommend leaving this unset**, which picks the right value for you:
   * - `true` normally, so multiple Rive graphics on a page share one context.
   * - `false` when `enableGPUCanvas` is on, because GPU Canvas needs a context
   *   of its own for each `<canvas>`.
   *
   * Setting it explicitly always wins. Setting it to `true` alongside
   * `enableGPUCanvas` means GPU Canvas content will not draw.
   */
  useOffscreenRenderer?: boolean;
  /**
   * @experimental This API is early and may encounter breaking behavior change without a major version bump
   *
   * Render GPU Canvas content, which draws through the runtime's deferred
   * renderer. False by default.
   *
   * IMPORTANT: Turning this on makes `useOffscreenRenderer` default to `false` for this
   * component if it was not specified, since a GPU Canvas session records for a single `<canvas>` context. Highly recommended to
   * only set `true` on this property for graphics that use GPU Canvas content, and leave
   * `enableGPUCanvas` unset, or set to `false` for other graphics on the page.
   *
   * Each of these takes its own WebGL context, and browsers cap how many a page may
   * have (the limit varies by browser), so enabling it on too many at once can throw.
   */
  enableGPUCanvas?: boolean;
  /**
   * Specify whether to disable Rive listeners on the canvas, thus preventing any event listeners to be attached to the canvas element
   */
  shouldDisableRiveListeners?: boolean;
  /**
   * Specify whether to resize the canvas to its container automatically
   */
  shouldResizeCanvasToContainer?: boolean;
  /**
   * Enable Rive Events to be handled by the runtime. This means any special Rive Event may have
   * functionality that can be invoked implicitly when detected.
   *
   * For example, if during the render loop an OpenUrlEvent is detected, the
   * browser may try to open the specified URL in the payload.
   *
   * This flag is false by default to prevent any unwanted behaviors from taking place.
   * This means any special Rive Event will have to be handled manually by subscribing to
   * EventType.RiveEvent
   *
   * @deprecated Rive Events are deprecated and will be removed in a future
   * major version: please use data binding instead. See
   * {@link https://rive.app/docs/runtimes/web/rive-events} for how to migrate.
   */
  automaticallyHandleEvents?: boolean;
}

const Rive = ({
  src,
  artboard,
  stateMachine,
  animations,
  stateMachines,
  layout,
  // No default: useRive treats a defined value as an explicit choice, and GPU
  // Canvas has to be able to bend the default. Left out of `options` below when
  // undefined, it falls through to defaultOptions — which will still be `true`.
  useOffscreenRenderer,
  enableGPUCanvas,
  shouldDisableRiveListeners = false,
  shouldResizeCanvasToContainer = true,
  automaticallyHandleEvents = false,
  children,
  ...rest
}: RiveProps & ComponentProps<'canvas'>) => {
  const params = {
    src,
    artboard,
    stateMachine,
    animations,
    layout,
    stateMachines,
    autoplay: true,
    shouldDisableRiveListeners,
    automaticallyHandleEvents,
    enableGPUCanvas,
  };

  const options = {
    shouldResizeCanvasToContainer,
    ...(useOffscreenRenderer !== undefined && { useOffscreenRenderer }),
  };

  const { RiveComponent } = useRive(params, options);
  return <RiveComponent {...rest}>{children}</RiveComponent>;
};

export default Rive;
