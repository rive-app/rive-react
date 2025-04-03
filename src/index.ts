import Rive, { RiveProps } from './components/Rive';
import useRive from './hooks/useRive';
import useStateMachineInput from './hooks/useStateMachineInput';
import useViewModel from './hooks/useViewModel';
import useViewModelInstance from './hooks/useViewModelInstance';
import useViewModelNumber from './hooks/useViewModelNumber';
import useViewModelProperties from './hooks/useViewModelProperties';
import useResizeCanvas from './hooks/useResizeCanvas';
import useRiveFile from './hooks/useRiveFile';

export default Rive;
export {
  useRive,
  useStateMachineInput,
  useResizeCanvas,
  useRiveFile,
  useViewModel,
  useViewModelInstance,
  useViewModelNumber,
  useViewModelProperties,
  RiveProps,
};
export {
  RiveState,
  UseRiveParameters,
  UseRiveFileParameters,
  UseRiveOptions,
} from './types';
export * from '@rive-app/canvas';
