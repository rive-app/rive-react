import React from 'react';
import { useRive } from '@rive-app/react-canvas';

const DirectionalFocus = () => {
  const { RiveComponent } = useRive({
    src: 'focus-tray.riv',
    artboard: 'Grid',
    stateMachine: 'State Machine 1',
    autoBind: true,
    autoplay: true,
    tabIndex: 0,
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <p style={{ maxWidth: 640, lineHeight: 1.5 }}>
        Click the canvas or Tab into it, then use arrow keys to move focus
        between the buttons; Enter activates.
      </p>
      <RiveComponent
        style={{ width: 640, height: 420, border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default DirectionalFocus;
