import Rive, { RiveProps } from './components/Rive';
import useRive from './hooks/useRive';
import useStateMachineInput from './hooks/useStateMachineInput';
import useResizeCanvas from './hooks/useResizeCanvas';
import useRiveFile from './hooks/useRiveFile';
import useStateMachineInputs from './hooks/useStateMachineInputs';

export default Rive;
export {
  useRive,
  useStateMachineInput,
  useStateMachineInputs,
  useResizeCanvas,
  useRiveFile,
  RiveProps,
};
export {
  RiveState,
  UseRiveParameters,
  UseRiveFileParameters,
  UseRiveOptions,
} from './types';

export * from '@rive-app/canvas';
