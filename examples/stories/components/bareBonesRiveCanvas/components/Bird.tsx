import { useRive } from '../../../../../src';
import React, { useEffect } from 'react';

export default function Bird({}) {
  const { RiveComponent } = useRive({
    stateMachines: 'State Machine 1',
    artboard: 'bird',
    src: 'map-accessories.riv',
    autoplay: true,
  });

  useEffect(() => {
    // console.log(`mount rive 🐓`);
    return () => {
      // console.log(`unmount rive 🐓`);
    };
  }, []);

  return (
    <div id="Rive-🐓" className="size-[100px] ring-1">
      <RiveComponent />
    </div>
  );
}
