import React, { useEffect } from 'react';
import { useRive, EventType, RiveEventType } from '@rive-app/react-canvas';

const Events = () => {
  const { rive, RiveComponent } = useRive({
    src: 'rating.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
    automaticallyHandleEvents: true,
  });

  const onRiveEventReceived = (riveEvent: any) => {
    console.log('Rive event received:', riveEvent);
    const eventData = riveEvent.data;
    const eventProperties = eventData.properties;
    if (eventData.type === RiveEventType.General) {
      console.log('Event name', eventData.name);
      console.log('Rating', eventProperties.rating);
      console.log('Message', eventProperties.message);
    }
  };

  // Wait until the rive object is instantiated before adding the Rive
  // event listener
  useEffect(() => {
    if (rive) {
      rive.on(EventType.RiveEvent, onRiveEventReceived);
    }
  }, [rive]);

  return <RiveComponent />;
};

export default Events;
