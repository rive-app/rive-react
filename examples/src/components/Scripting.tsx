import React from 'react';
import { useRive } from '@rive-app/react-canvas';

const ScriptedEffect = () => {
  const { RiveComponent } = useRive({
    src: 'scripted-path-effect.riv',
    artboard: 'Multishape',
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  return <RiveComponent />;
};

export default ScriptedEffect;
