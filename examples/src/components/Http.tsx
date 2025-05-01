import React from 'react';
import { useRive } from '@rive-app/react-canvas';

const Http = () => {
  const { RiveComponent } = useRive({
    src: 'https://cdn.rive.app/animations/vehicles.riv',
    stateMachines: 'bumpy',
    autoplay: true,
  });

  return <RiveComponent />;
};

export default Http;
