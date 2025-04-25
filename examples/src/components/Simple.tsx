import React from 'react';
import { useRive } from '@rive-app/react-canvas';

const Simple = () => {
  const { RiveComponent } = useRive({
    src: 'avatars.riv',
    artboard: 'Avatar 3',
    autoplay: true,
  });

  return <RiveComponent />;
};

export default Simple;
