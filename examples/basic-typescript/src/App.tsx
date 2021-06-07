import { useRive, UseRiveParameters } from "rive-react";

function App() {
  const params: UseRiveParameters = {
    src: "poison-loader.riv",
    autoplay: true,
  };

  const { RiveComponent } = useRive(params);

  return (
    // The animation will fit to the parent element.
    <div style={{ height: "500px", width: "500px" }}>
      <RiveComponent />
    </div>
  );
}

export default App;
