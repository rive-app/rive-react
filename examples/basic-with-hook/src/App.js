import { useRive } from 'rive-react';

function App() {
  const params = {
    src: 'poison-loader.riv',
    autoplay: true,
  };

  const { RiveComponent: RiveComponentBasic } = useRive(params);

  const { RiveComponent: RiveComponentTouch } = useRive({
    src: 'magic-ball.riv',
    autoplay: true,
    stateMachines: "Main State Machine",
  });

  return (
    <>
      <div style={{ height: '500px', width: '500px' }}>
        <RiveComponentBasic />
      </div>
      <div style={{ height: '300px', width: '300px' }}>
        <RiveComponentTouch />
      </div>
    </>
  );
}

export default App;
