import React from 'react';
import { Fit, useRive, Layout } from '@rive-app/react-canvas';

const ResponsiveLayout = () => {
  const { RiveComponent } = useRive({
    src: 'layout_test.riv',
    artboard: 'Artboard',
    stateMachines: 'State Machine 1',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Layout,
    }),
  });

  return <RiveComponent />;
};

export default ResponsiveLayout;
