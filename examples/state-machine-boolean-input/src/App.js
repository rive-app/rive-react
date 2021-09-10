import { useRive, useStateMachineInput } from 'rive-react';

function App() {
  const STATE_MACHINE_NAME = 'State Machine 1';
  const ON_HOVER_INPUT_NAME = 'Hover';
  const ON_PRESSED_INPUT_NAME = 'Pressed';

  const { RiveComponent, rive } = useRive({
    src: 'like.riv',
    stateMachines: STATE_MACHINE_NAME,
    artboard: 'New Artboard',
    autoplay: true,
  });

  // Both onHoverInput and onPressedInput are boolean inputs. To transition
  // states we need to set the value property to true or false.
  const onHoverInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    ON_HOVER_INPUT_NAME
  );
  const onPressedInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    ON_PRESSED_INPUT_NAME
  );

  function onMouseEnter() {
    onHoverInput.value = true;
  }

  function onMouseLeave() {
    onHoverInput.value = false;
  }

  function onMouseDown() {
    onPressedInput.value = true;
  }

  function onMouseUp() {
    onPressedInput.value = false;
  }

  return (
    // The animation will fit to the parent element, so we set a large height
    // and width for this example.
    <div style={{ height: '500px', width: '500px' }}>
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
