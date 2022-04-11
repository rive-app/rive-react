import { Layout } from '@rive-app/webgl';
import React, { ComponentProps } from 'react';
import useRive from '../hooks/useRive';

export type RiveProps = {
  src: string;
  artboard?: string;
  animations?: string | string[];
  stateMachines?: string | string[];
  layout?: Layout;
  useOffscreenRenderer?: boolean;
  canvasProps?: ComponentProps<'canvas'>;
};

const Rive = ({
  src,
  artboard,
  animations,
  stateMachines,
  layout,
  useOffscreenRenderer = true,
  canvasProps = {},
  ...rest
}: RiveProps & ComponentProps<'div'>) => {
  const params = {
    src,
    artboard,
    animations,
    stateMachines,
    layout,
    autoplay: true,
  };

  const options = {
    useOffscreenRenderer,
    canvasProps,
  };

  const { RiveComponent } = useRive(params, options);
  return <RiveComponent {...rest} />;
};

export default Rive;
