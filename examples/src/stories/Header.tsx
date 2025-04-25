import React from 'react';
import { useRive } from '@rive-app/react-canvas';


import { Button } from './Button';
import './header.css';

type User = {
  name: string;
};

export interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
}

export const Header = ({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) => {
   const { RiveComponent } = useRive({
    src: 'https://cdn.rive.app/animations/vehicles.riv',
    stateMachines: "bumpy",
    autoplay: true,
  });

  return (
    <header className='header'>
      <RiveComponent
      />
    </header>
  )
};
