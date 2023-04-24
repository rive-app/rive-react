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
   * Specify a starting animation to play.
   */
  animations?: string | string[];
  /**
   * Specify a starting state machine to play.
   */
  stateMachines?: string | string[];
  /**
   * Specify a starting Layout object to set Fill and Alignment for the drawing surface. See docs at https://help.rive.app/runtimes/layout for more on layout configuration.
   */
  layout?: Layout;
  /**
   * For `@rive-app/react-webgl`, sets this property to maintain a single WebGL context for multiple canvases. **We recommend to keep the default value** when rendering multiple Rive instances on a page.
   */
  useOffscreenRenderer?: boolean;
  /**
   * Specify whether to disable Rive listeners on the canvas, thus preventing any event listeners to be attached to the canvas element
   */
  shouldDisableRiveListeners?: boolean;
}

const Rive = ({
  src,
  artboard,
  animations,
  stateMachines,
  layout,
  useOffscreenRenderer = true,
  shouldDisableRiveListeners = false,
  ...rest
}: RiveProps & ComponentProps<'canvas'>) => {
  const params = {
    src,
    artboard,
    animations,
    layout,
    stateMachines,
    autoplay: true,
    shouldDisableRiveListeners,
  };

  const options = {
    useOffscreenRenderer,
  };

  const { RiveComponent } = useRive(params, options);
  return <RiveComponent {...rest} />;
};

export default Rive;
