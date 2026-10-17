import React from 'react';
import { useRive } from '@rive-app/react-canvas';

const RiveInstance = () => {
  const { RiveComponent } = useRive(
    {
      src: 'avatars.riv',
      artboard: 'Avatar 3',
      autoplay: true,
    },
    {
      useOffscreenRenderer: true,
      shouldUseIntersectionObserver: true,
    }
  );

  return (
    <div style={{ width: 120, height: 120 }}>
      <RiveComponent />
    </div>
  );
};

const MultipleInstances = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />

      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />

      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />

      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />

      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />

      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
      <RiveInstance />
    </div>
  );
};

export default MultipleInstances;