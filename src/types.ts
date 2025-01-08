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

export type UseViewModelInstancePropertyType =
  | UseViewModelInstanceNumberParameters
  | UseViewModelInstanceStringParameters
  | UseViewModelInstanceBooleanParameters
  | UseViewModelInstanceColorParameters;

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
