import { Layout } from 'rive-js';
import React, { ComponentProps } from 'react';
import useRive from '../hooks/useRive';

export type RiveProps = {
  src: string;
  artboard?: string;
  animations?: string | string[];
  layout?: Layout;
};

const Rive = ({
  src,
  artboard,
  animations,
  layout,
  ...rest
}: RiveProps & ComponentProps<'div'>) => {
  const params = {
    src,
    artboard,
    animations,
    layout,
    autoplay: true,
  };

  const { RiveComponent } = useRive(params);
  return <RiveComponent {...rest} />;
};

export default Rive;
