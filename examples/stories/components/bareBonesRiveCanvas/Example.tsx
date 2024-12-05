import React, { useState, useRef, useEffect } from 'react';

import Bird from './components/Bird';
import Tree from './components/Tree';

export default function App() {
  return (
    <div className="flex size-full justify-center items-center gap-4">
      <RiveTest />
      <StaticTest />
    </div>
  );
}

function StaticTest() {
  const [counter, setCounter] = useState<number>(0);

  const [running, setRunning] = useState<boolean>(false);
  const intervalRef = useRef<number>();
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setCounter((prev) => prev + 1);
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [running]);

  return (
    <div className="size-full flex items-center justify-center flex-col gap-4">
      <h1>Static</h1>
      <Button onClick={() => setRunning((prev) => !prev)}>
        {running ? 'remounting...' : 'Start'}
      </Button>
      <FakeAsset id="🌲" key={counter + 'tree'} />
      <FakeAsset id="🐓" key={counter + 'bird'} />
    </div>
  );
}

function RiveTest() {
  const [counter, setCounter] = useState<number>(0);

  const [running, setRunning] = useState<boolean>(false);
  const intervalRef = useRef<number>();
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setCounter((prev) => prev + 1);
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [running]);

  return (
    <div className="size-full flex items-center justify-center flex-col gap-4">
      <h1>Rive</h1>
      <Button onClick={() => setRunning((prev) => !prev)}>
        {running ? 'remounting...' : 'Start'}
      </Button>
      <Tree key={counter + 'tree'} />
      <Bird key={counter + 'bird'} />
    </div>
  );
}

const useId = () => {
  // random id
  return Math.random().toString(36).substring(7);
};

function FakeAsset({ id }: { id: string; key: string }) {
  const internalId = useId();
  useEffect(() => {
    console.log(`[${internalId}] mount static ${id}`);
    return () => {
      console.log(`[${internalId}] unmount static ${id}`);
    };
  }, [id, internalId]);

  return (
    <div
      id={`Static-${id}`}
      className="size-[100px] ring-1 text-2xl flex items-center justify-center"
    >
      {id}
    </div>
  );
}

// ---
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, ...props }: ButtonProps) {
  return (
    <button className="ring-1 p-4" {...props}>
      {children}
    </button>
  );
}
