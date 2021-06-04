import { useRive } from "rive-react";

function App() {
  const params = {
    src: "poison-loader.riv",
    autoplay: false,
  };

  const { RiveComponent, rive } = useRive(params);

  function onMouseEnter() {
    // `rive` will return as null until the file as fully loaded, so we include this
    // guard to prevent any unwanted errors.
    if (rive) {
      rive.play();
    }
  }

  function onMouseLeave() {
    if (rive) {
      rive.pause();
    }
  }

  return (
    <div style={{ height: "600px", width: "600px" }}>
      <RiveComponent onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
    </div>
  );
}

export default App;
