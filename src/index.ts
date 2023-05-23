import Rive from './components/Rive';
import useRive from './hooks/useRive';
import useStateMachineInput from './hooks/useStateMachineInput';
import useResizeCanvas from './hooks/useResizeCanvas';

export default Rive;
export { useRive, useStateMachineInput, useResizeCanvas };
export { RiveState, UseRiveParameters, UseRiveOptions } from './types';
export * from '@rive-app/canvas';
