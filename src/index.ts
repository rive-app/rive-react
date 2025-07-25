import Rive, { RiveProps } from './components/Rive';
import useRive from './hooks/useRive';
import useStateMachineInput from './hooks/useStateMachineInput';
import useViewModel from './hooks/useViewModel';
import useViewModelInstance from './hooks/useViewModelInstance';
import useViewModelInstanceNumber from './hooks/useViewModelInstanceNumber';
import useViewModelInstanceString from './hooks/useViewModelInstanceString';
import useViewModelInstanceBoolean from './hooks/useViewModelInstanceBoolean';
import useViewModelInstanceColor from './hooks/useViewModelInstanceColor';
import useViewModelInstanceEnum from './hooks/useViewModelInstanceEnum';
import useViewModelInstanceTrigger from './hooks/useViewModelInstanceTrigger';
import useViewModelInstanceImage from './hooks/useViewModelInstanceImage';
import useViewModelInstanceList from './hooks/useViewModelInstanceList';
import useResizeCanvas from './hooks/useResizeCanvas';
import useRiveFile from './hooks/useRiveFile';
import useViewModelInstanceArtboard from './hooks/useViewModelInstanceArtboard';

export default Rive;
export {
    useRive,
    useStateMachineInput,
    useResizeCanvas,
    useRiveFile,
    useViewModel,
    useViewModelInstance,
    useViewModelInstanceNumber,
    useViewModelInstanceString,
    useViewModelInstanceBoolean,
    useViewModelInstanceColor,
    useViewModelInstanceEnum,
    useViewModelInstanceTrigger,
    useViewModelInstanceImage,
    useViewModelInstanceList,
    useViewModelInstanceArtboard,
    RiveProps,
};
export {
    RiveState,
    UseRiveParameters,
    UseRiveFileParameters,
    UseRiveOptions,
} from './types';
export * from '@rive-app/canvas';