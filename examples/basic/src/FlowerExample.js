import { useEffect, useState } from 'react';
import { useRive } from 'rive-react';

function FlowerExample() {
  const { rive, canvas, RiveComponent } = useRive({
    src: 'flower.riv',
    artboard: 'Motion',
    animations: 'Animation 1',
    autoplay: true,
  });

  useEffect(() => {
    console.log('change');
    if (canvas) {
      canvas.width = 200;
      canvas.height = 200;
    }
  }, [canvas]);

  function onLargerClick() {
    if (rive && canvas) {
      canvas.width = canvas.width + 50;
      canvas.height = canvas.height + 50;
      rive.resizeToCanvas();
    }
  }

  function onSmallerClick() {
    if (rive && canvas && canvas.width > 0) {
      canvas.width = canvas.width - 50;
      canvas.height = canvas.height - 50;
      rive.resizeToCanvas();
    }
  }

  return (
    // The animation will fit to the parent element.
    <>
      <button onClick={onLargerClick}>Larger</button>
      <button onClick={onSmallerClick}>Smaller</button>
      <div>
        <RiveComponent />
      </div>
    </>
  );
}

export default FlowerExample;
