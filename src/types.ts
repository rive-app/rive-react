import {
  Rive,
  RiveFile,
  RiveFileParameters,
  RiveParameters,
  ViewModelInstance,
  ViewModelInstanceBoolean,
  ViewModelInstanceNumber,
  ViewModelInstanceString,
  ViewModelInstanceColor,
} from '@rive-app/canvas';
import { ComponentProps, RefCallback } from 'react';

export type UseRiveParameters = Partial<Omit<RiveParameters, 'canvas'>> | null;

export type UseRiveOptions = {
  useDevicePixelRatio: boolean;
  customDevicePixelRatio: number;
  fitCanvasToArtboardHeight: boolean;
  useOffscreenRenderer: boolean;
  shouldResizeCanvasToContainer: boolean;
  shouldUseIntersectionObserver?: boolean;
};

export type Dimensions = {
  width: number;
  height: number;
};

/**
 * @typedef RiveState
 * @property canvas - Canvas element the Rive Animation is attached to.
 * @property container - Container element of the canvas.
 * @property setCanvasRef - Ref callback to be passed to the canvas element.
 * @property setContainerRef - Ref callback to be passed to the container
 * element of the canvas. This is optional, however if not used then the hook
 * will not take care of automatically resizing the canvas to it's outer
 *   container if the window resizes.
 * @property rive - The loaded Rive Animation
 */
export type RiveState = {
  canvas: HTMLCanvasElement | null;
  container: HTMLElement | null;
  setCanvasRef: RefCallback<HTMLCanvasElement>;
  setContainerRef: RefCallback<HTMLElement>;
  rive: Rive | null;
  RiveComponent: (props: ComponentProps<'canvas'>) => JSX.Element;
};

export type UseRiveFileParameters = Partial<
  Omit<RiveFileParameters, 'onLoad' | 'onLoadError'>
>;

export type FileStatus = 'idle' | 'loading' | 'failed' | 'success';

/**
 * @typedef RiveFileState
 * @property data - The RiveFile instance
 * @property status - The status of the file
 */
export type RiveFileState = {
  riveFile: RiveFile | null;
  status: FileStatus;
};

export type UseViewModelParameters = {
  useDefault?: boolean;
  name?: string;
};

export type UseViewModelInstanceParameters = {
  useNew?: boolean;
  useDefault?: boolean;
  name?: string;
};

export type UseViewModelInstanceValueParameters = {
  viewModelInstance?: ViewModelInstance | null;
  rive?: Rive | null;
};

export type UseViewModelInstanceNumberParameters =
  UseViewModelInstanceValueParameters & {
    initialValue?: number;
  };

export type UseViewModelInstanceStringParameters =
  UseViewModelInstanceValueParameters & {
    initialValue?: string;
  };

export type UseViewModelInstanceBooleanParameters =
  UseViewModelInstanceValueParameters & {
    initialValue?: boolean;
  };

export type UseViewModelInstanceColorParameters =
  UseViewModelInstanceValueParameters & {
    initialValue?: number;
  };

export type UseViewModelInstanceEnumParameters =
  UseViewModelInstanceValueParameters & {
    initialValue?: string;
  };

export type UseViewModelInstanceTriggerParameters = UseViewModelInstanceValueParameters & {
  /**
   * Callback that runs when the trigger is fired.
   */
  onTrigger?: () => void;
};


export type UseViewModelInstancePropertyType =
  | UseViewModelInstanceNumberParameters
  | UseViewModelInstanceStringParameters
  | UseViewModelInstanceBooleanParameters
  | UseViewModelInstanceColorParameters
  | UseViewModelInstanceEnumParameters;

export type AcceptedVieModelType<T> =
  T extends UseViewModelInstanceNumberParameters
  ? ViewModelInstanceNumber
  : T extends UseViewModelInstanceStringParameters
  ? ViewModelInstanceString
  : T extends UseViewModelInstanceBooleanParameters
  ? ViewModelInstanceBoolean
  : T extends UseViewModelInstanceColorParameters
  ? ViewModelInstanceColor
  : never;

export type UseViewModelInstanceNumberResult = {
  /**
   * The current value of the number.
   */
  value: number;
  /**
   * Set the value of the number.
   * @param value - The value to set the number to.
   */
  setValue: (value: number) => void;
};
export type UseViewModelInstanceStringResult = {
  /**
   * The current value of the string.
   */
  value: string;
  /**
   * Set the value of the string.
   * @param value - The value to set the string to.
   */
  setValue: (value: string) => void;
};
export type UseViewModelInstanceBooleanResult = {
  /**
   * The current value of the boolean.
   */
  value: boolean;
  /**
   * Set the value of the boolean.
   * @param value - The value to set the boolean to.
   */
  setValue: (value: boolean) => void;
};

export type UseViewModelInstanceColorResult = {
  /**
   * The current value of the color.
   */
  value: number;
  /**
   * Set the value of the color.
   * @param value - The value to set the color to.
   */
  setValue: (value: number) => void;
  /**
   * Set the red value of the color.
   * @param r - The red value to set the color to.
   */
  setRgb: (r: number, g: number, b: number) => void;
  /**
   * Set the red, green, blue, and alpha values of the color.
   * @param r - The red value to set the color to.
   * @param g - The green value to set the color to.
   * @param b - The blue value to set the color to.
   * @param a - The alpha value to set the color to.
   */
  setRgba: (r: number, g: number, b: number, a: number) => void;
  /**
   * Set the alpha value of the color.
   * @param a - The alpha value to set the color to.
   */
  setAlpha: (a: number) => void;
  /**
   * Set the opacity value of the color.
   * @param o - The opacity value to set the color to.
   */
  setOpacity: (o: number) => void;
};

export type UseViewModelInstanceEnumResult = {
  /**
   * The current value of the enum.
   */
  value: string;
  /**
   * Set the value of the enum.
   * @param value - The value to set the enum to.
   */
  setValue: (value: string) => void;
  /**
   * The values of the enum.
   */
  values: string[];
};

export type UseViewModelInstanceTriggerResult = {
  /**
   * Fires the property trigger.
   */
  trigger: () => void;
};