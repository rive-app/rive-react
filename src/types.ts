import { RefCallback, ComponentProps } from 'react';
import { Rive, RiveParameters } from '@rive-app/webgl';

export type UseRiveParameters = Partial<Omit<RiveParameters, 'canvas'>> | null;

export type UseRiveOptions = {
  useDevicePixelRatio: boolean;
  fitCanvasToArtboardHeight: boolean;
  useOffscreenRenderer: boolean;
};

export type Dimensions = {
  width: number;
  height: number;
};

/**
 * @typedef RiveState
 * @property canvas - Canvas element the Rive Animation is attached to.
 * @property setCanvasRef - Ref callback to be passed to the canvas element.
 * @property setContainerRef - Ref callback to be passed to the container element
 *   of the canvas. This is optional, however if not used then the hook will
 *   not take care of automatically resizing the canvas to it's outer
 *   container if the window resizes.
 * @property rive - The loaded Rive Animation
 */
export type RiveState = {
  canvas: HTMLCanvasElement | null;
  setCanvasRef: RefCallback<HTMLCanvasElement>;
  setContainerRef: RefCallback<HTMLElement>;
  rive: Rive | null;
  RiveComponent: (props: ComponentProps<'div'>) => JSX.Element;
};
