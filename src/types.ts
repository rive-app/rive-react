import { RefCallback, ComponentProps } from 'react';
import { Rive, RiveParameters } from 'rive-js';

/**
 * @typedef UseStateMachineInputParameters
 * @property rive - Rive Instance
 * @property stateMachineName - Name of the state machine
 * @property inputName - Name of the input
 */
export type UseStateMachineInputParameters = {
  rive: Rive | null;
  stateMachineName?: string;
  inputName?: string;
};

export type UseRiveParameters = Partial<Omit<RiveParameters, 'canvas'>> | null;

export type UseRiveOptions = {
  useDevicePixelRatio: boolean;
  fitCanvasToArtboardHeight: boolean;
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
  debug: () => void;
  canvas: HTMLCanvasElement | null;
  setCanvasRef: RefCallback<HTMLCanvasElement>;
  setContainerRef: RefCallback<HTMLElement>;
  rive: Rive | null;
  RiveComponent: (props: ComponentProps<'div'>) => JSX.Element;
};
