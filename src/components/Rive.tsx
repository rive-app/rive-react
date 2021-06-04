import React from "react";
import { Layout } from "rive-js";
import { ComponentProps } from "react";
import useRive from "../hooks/useRive";

export type RiveProps = {
  src: string;
  artboard?: string;
  animations?: string;
  layout?: Layout;
  autoplay?: boolean;
};

const Rive = ({
  src,
  artboard,
  animations,
  layout,
  autoplay,
  ...rest
}: RiveProps & ComponentProps<"div">) => {
  const params = {
    src,
    artboard,
    animations,
    layout,
    autoplay,
  };

  const { RiveComponent } = useRive(params);
  return <RiveComponent {...rest} />;
};

export default Rive;
