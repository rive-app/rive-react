import './App.css';
import { useState } from 'react';
import { useRive } from 'rive-react';
import { useCallback } from 'react';
import { useRef } from 'react';

import { Rive, EventType } from '@rive-app/canvas';
import { useEffect } from 'react';

function App() {
  const [render, setRender] = useState(true);

  function onClick() {
    console.log('click');
    setRender(false);
    setTimeout(() => {
      setRender(true);
    }, 300);
  }

  return (
    <div className="App">
      <button onClick={onClick}>reload</button>
      {render && <AnimationList />}
    </div>
  );
}

function AnimationList() {
  const animations = [];
  for (let i = 0; i < 32; i++) {
    animations.push(<Animation key={i} />);
  }
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px , 1fr))',
      }}
    >
      {animations}
    </div>
  );
}

function Animation() {
  const { RiveComponent } = useRive({
    src: 'https://public.uat.rive.app/community/runtime-files/108-165-rgb-loader.riv',
    artboard: 'Loader',
    animations: 'Animation 1',
    autoplay: true,
  });
  return (
    <div style={{ height: '200px', width: '200px' }}>
      <RiveComponent />
    </div>
  );
}

function Image() {
  return (
    <div>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Codomain2.SVG/330px-Codomain2.SVG.png" />
    </div>
  );
}

function Canvas() {
  const canvasRef = useRef(null);

  function draw() {
    if (canvasRef.current === null) {
      return;
    }

    const ctx = canvasRef.current.getContext('2d');

    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
    requestAnimationFrame(draw);
  }

  const setCanvasRef = useCallback((canvas) => {
    canvasRef.current = canvas;
    if (canvas) {
      draw();
    }
  }, []);

  return (
    <div>
      <canvas ref={setCanvasRef} height={200} width={200} />
    </div>
  );
}

function SimpleAnimation() {
  const riveRef = useRef(null);

  const setCanvasRef = useCallback((canvas) => {
    if (canvas) {
      riveRef.current = new Rive({
        useOffscreenRenderer: true,
        src: 'https://public.rive.app/community/runtime-files/787-1531-simple-tree-animation.riv',
        artboard: 'New Artboard',
        animations: 'idle',
        autoplay: true,
        canvas,
      });

      riveRef.current.on(EventType.Load, () => {
        riveRef.current.play();
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      riveRef.current.stop();
      riveRef.current.stopRendering();
      riveRef.current.cleanup();
      if (riveRef.current.file) {
        riveRef.current.file.delete();
      }
      riveRef.current.renderer.delete();
      riveRef.current.runtime.cleanup();
      riveRef.current = null;
    };
  }, []);

  return (
    <div>
      <canvas ref={setCanvasRef} />
    </div>
  );
}

export default App;
