import { Layout } from '@rive-app/canvas';
import React, { ComponentProps } from 'react';
import useRive from '../hooks/useRive';

export type RiveProps = {
  src: string;
  artboard?: string;
  animations?: string | string[];
  stateMachines?: string | string[];
  layout?: Layout;
  useOffscreenRenderer?: boolean;
};

const Rive = ({
  src,
  artboard,
  animations,
  stateMachines,
  layout,
  useOffscreenRenderer = true,
  ...rest
}: RiveProps & ComponentProps<'canvas'>) => {
  const params = {
    src,
    artboard,
    animations,
    layout,
    stateMachines,
    autoplay: true,
  };

  const options = {
    useOffscreenRenderer,
  };

  const { RiveComponent } = useRive(params, options);
  return <RiveComponent {...rest} />;
};

export default Rive;
