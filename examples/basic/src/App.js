import Rive from 'rive-react';

function App() {
  return (
    // The animation will fit to the parent element.
    <div style={{ height: '500px', width: '500px' }}>
      <Rive src="poison-loader.riv" autoplay />
    </div>
  );
}

export default App;
