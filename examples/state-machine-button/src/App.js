import { useRive, useStateMachineInput } from "rive-react";

function App() {
  const { RiveComponent, rive } = useRive({
    src: "like.riv",
    stateMachines: "State Machine 1",
    artboard: "New Artboard",
    autoplay: true,
  });

  const hoverInput = useStateMachineInput(rive, "State Machine 1", "Hover");
  const pressedInput = useStateMachineInput(rive, "State Machine 1", "Pressed");

  function onMouseEnter() {
    // state machine inputs will be null until the rive file has loaded, so we
    // put these guards in place to avoid any errors.
    if (hoverInput) {
      hoverInput.value = true;
    }
  }

  function onMouseLeave() {
    if (hoverInput) {
      hoverInput.value = false;
    }
  }

  function onMouseDown() {
    if (pressedInput) {
      pressedInput.value = true;
    }
  }

  function onMouseUp() {
    if (pressedInput) {
      pressedInput.value = false;
    }
  }

  return (
    // The animation will fit to the parent element, so we set a large height
    // and width for this example.
    <div style={{ height: "500px", width: "500px" }}>
      <RiveComponent
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />
    </div>
  );
}

export default App;
