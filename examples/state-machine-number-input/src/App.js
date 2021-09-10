import { useRive, useStateMachineInput } from 'rive-react';

function App() {
  const STATE_MACHINE_NAME = 'State Machine ';
  const INPUT_NAME = 'Level';

  const { RiveComponent, rive } = useRive({
    src: 'skills.riv',
    stateMachines: STATE_MACHINE_NAME,
    artboard: 'New Artboard',
    autoplay: true,
  });

  // levelInput is a number state machine input. To transition the state machine,
  // we need to set the value to a number. For this state machine input, we need
  // to set to 0, 1 or 2 for a state transition to occur.
  const levelInput = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_NAME);

  return (
    // The animation will fit to the parent element, so we set a large height
    // and width for this example.
    <div style={{ height: '500px', width: '500px' }}>
      <RiveComponent />
      <div>
        Level:
        <button onClick={() => (levelInput.value = 0)}>0</button>
        <button onClick={() => (levelInput.value = 1)}>1</button>
        <button onClick={() => (levelInput.value = 2)}>2</button>
      </div>
    </div>
  );
}

export default App;
