import { Layout } from '@rive-app/canvas';
import React, { ComponentProps } from 'react';
import useRive from '../hooks/useRive';

export type RiveProps = {
  src: string;
  artboard?: string;
  animations?: string | string[];
  layout?: Layout;
  useOffscreenRenderer?: boolean;
};

const Rive = ({
  src,
  artboard,
  animations,
  layout,
  useOffscreenRenderer = true,
  ...rest
}: RiveProps & ComponentProps<'div'>) => {
  const params = {
    src,
    artboard,
    animations,
    layout,
    autoplay: true,
  };

  const options = {
    useOffscreenRenderer,
  };

  const { RiveComponent } = useRive(params, options);
  return <RiveComponent {...rest} />;
};

export default Rive;
