import React from 'react';

export const Button = ({onClick, children}) => {
  return (
    <button className="btn" onClick={onClick}>{children}</button>
  );
};
