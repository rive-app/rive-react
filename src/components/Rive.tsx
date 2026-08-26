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
   * For `@rive-app/react-webgl2`, sets this property to maintain a single WebGL context for multiple canvases. **We recommend to keep the default value** when rendering multiple Rive instances on a page.
   */
  useOffscreenRenderer?: boolean;
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
  useOffscreenRenderer = true,
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
  };

  const options = {
    useOffscreenRenderer,
    shouldResizeCanvasToContainer,
  };

  const { RiveComponent } = useRive(params, options);
  return <RiveComponent {...rest}>{children}</RiveComponent>;
};

export default Rive;
