import { useEffect, useState } from 'react';
import { useRive } from 'rive-react';

function App() {
  const [buttonText, setButtonText] = useState('Pause');
  const { RiveComponent, rive } = useRive({
    src: 'poison-loader.riv',
    autoplay: true,
  });

  useEffect(() => {
    if (rive) {
      // "play" event is fired when the animation starts to play, so we update
      // button text on this event.
      rive.on('play', () => {
        setButtonText('Pause');
      });

      // As above, the "pause" event is fired when the animation pauses.
      rive.on('pause', () => {
        setButtonText('Play');
      });
    }
    // We listen for changes to the rive object. The rive object will be null
    // until the rive file has loaded.
  }, [rive]);

  function onButtonClick() {
    // `rive` will return as null until the file as fully loaded, so we include this
    // guard to prevent any unwanted errors.
    if (rive) {
      if (rive.isPlaying) {
        rive.pause();
      } else {
        rive.play();
      }
    }
  }

  return (
    // The animation will fit to the parent element, so we set a large height
    // and width for this example.
    <div style={{ height: '500px', width: '500px' }}>
      <RiveComponent />
      <button onClick={onButtonClick}>{buttonText}</button>
    </div>
  );
}

export default App;
