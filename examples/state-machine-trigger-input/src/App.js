import { useRive, useStateMachineInput } from 'rive-react';

function App() {
  const STATE_MACHINE_NAME = 'State Machine 1';
  const INPUT_NAME = 'Pressed';

  const { RiveComponent, rive } = useRive({
    src: 'piggy-bank.riv',
    stateMachines: STATE_MACHINE_NAME,
    artboard: 'New Artboard',
    autoplay: true,
  });

  // pressedInput in a trigger state machine input. To transition the state
  // we need to call the `fire()` method on the input.
  const pressedInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    INPUT_NAME
  );

  return (
    // The animation will fit to the parent element, so we set a large height
    // and width for this example.
    <div style={{ height: '500px', width: '500px' }}>
      <RiveComponent onClick={() => pressedInput.fire()} />
    </div>
  );
}

export default App;
