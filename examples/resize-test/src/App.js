import { useRive } from 'rive-react';

function App() {
  const params = {
    src: 'poison-loader.riv',
    autoplay: true,
  };

  const { RiveComponent: RiveComponentBasic } = useRive(params);
  const { RiveComponent: RiveComponentBasic2 } = useRive(params);
  const { RiveComponent: RiveComponentBasic3 } = useRive(params);

  return (
    <>
      <div style={{ width: '100%' }}>
        <div style={{ height: '300px', width: '100%' }}>
          <RiveComponentBasic />
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <RiveComponentBasic2 />
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <RiveComponentBasic3 />
        </div>
      </div>
    </>
  );
}

export default App;
