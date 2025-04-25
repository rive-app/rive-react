import React from 'react';
import { useRive } from '@rive-app/react-canvas';

type User = {
  name: string;
};

export interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
}

export const RiveThing = ({
  user,
  onLogin,
  onLogout,
  onCreateAccount,
}: HeaderProps) => {
  const { RiveComponent } = useRive({
    src: 'https://cdn.rive.app/animations/vehicles.riv',
    stateMachines: 'bumpy',
    autoplay: true,
  });

  return (
    <header className="header">
      <RiveComponent />
    </header>
  );
};
