import {
  Rive,
  type ViewModel,
  RiveFile,
  RiveFileParameters,
  RiveParameters,
  type ViewModelInstance,
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

/**
 * Parameters for retrieving a ViewModel from a Rive instance.
 *
 * @property rive - The Rive instance to retrieve the ViewModel from.
 * @property name - When provided, specifies the name of the ViewModel to retrieve.
 * @property useDefault - When true, uses the default ViewModel from the Rive instance.
 */
export type UseViewModelParameters =
  | { rive: Rive | null; name: string; useDefault?: never }
  | { rive: Rive | null; useDefault?: boolean; name?: never };

/**
 * Parameters for retrieving a ViewModelInstance.
 *
 * @property viewModel - The ViewModel to get an instance from.
 * @property name - When provided, specifies the name of the instance to retrieve.
 * @property useDefault - When true, uses the default instance from the ViewModel.
 * @property useNew - When true, creates a new instance of the ViewModel.
 * @property rive - When provided, automatically binds the instance to this Rive instance.
 */
export type UseViewModelInstanceParameters =
  | { viewModel: ViewModel | null; name: string; rive?: Rive | null; useDefault?: never; useNew?: never }
  | { viewModel: ViewModel | null; useDefault?: boolean; rive?: Rive | null; name?: never; useNew?: never }
  | { viewModel: ViewModel | null; useNew?: boolean; rive?: Rive | null; name?: never; useDefault?: never };

export type UseViewModelInstanceValueParameters = {
  viewModelInstance?: ViewModelInstance | null;
};

/**
 * Parameters for interacting with number properties of a ViewModelInstance
 * @property path - Path to the number property (e.g. "speed" or "group/speed")
 * @property viewModelInstance - The ViewModelInstance containing the number property
 */
export type UseViewModelInstanceNumberParameters = {
  path: string;
  viewModelInstance?: ViewModelInstance | null;
};

/**
 * Parameters for interacting with string properties of a ViewModelInstance
 * @property path - Path to the string property (e.g. "text" or "nested/text")
 * @property viewModelInstance - The ViewModelInstance containing the string property
 */
export type UseViewModelInstanceStringParameters = {
  path: string;
  viewModelInstance?: ViewModelInstance | null;
};

/**
 * Parameters for interacting with boolean properties of a ViewModelInstance
 * @property path - Path to the boolean property (e.g. "agreedToTerms" or "group/agreedToTerms")
 * @property viewModelInstance - The ViewModelInstance containing the boolean property
 */
export type UseViewModelInstanceBooleanParameters = {
  path: string;
  viewModelInstance?: ViewModelInstance | null;
};

/**
 * Parameters for interacting with color properties of a ViewModelInstance
 * @property path - Path to the color property (e.g. "color" or "group/color")
 * @property viewModelInstance - The ViewModelInstance containing the color property
 */
export type UseViewModelInstanceColorParameters = {
  path: string;
  viewModelInstance?: ViewModelInstance | null;
};

/**
 * Parameters for interacting with enum properties of a ViewModelInstance
 * @property path - Path to the enum property (e.g. "state" or "group/state")
 * @property viewModelInstance - The ViewModelInstance containing the enum property
 */
export type UseViewModelInstanceEnumParameters = {
  path: string;
  viewModelInstance?: ViewModelInstance | null;
};

/**
 * Parameters for interacting with trigger properties of a ViewModelInstance
 * @property path - Path to the trigger property (e.g. "onTap" or "group/onTap")
 * @property viewModelInstance - The ViewModelInstance containing the trigger
 * @property onTrigger - Callback that runs when the trigger fires
 */
export type UseViewModelInstanceTriggerParameters = {
  path: string;
  viewModelInstance?: ViewModelInstance | null;
  onTrigger?: () => void;
};



export type UseViewModelInstanceNumberResult = {
  /**
   * The current value of the number.
   */
  value: number | null;
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
  value: string | null;
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
  value: boolean | null;
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
  value: number | null;
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
  value: string | null;
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