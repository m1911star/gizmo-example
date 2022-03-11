import React from 'react';
import './App.css';
import { main } from './utils';
function App() {
  React.useLayoutEffect(() => {
    const { helper } = main();
    document.getElementById('helper')?.appendChild(helper);
    function animate() {
      requestAnimationFrame(animate);
      helper.update();
    }
    animate();
  }, []);
  const width = window.innerWidth;
  const height = window.innerHeight;
  return (
    <div className="App">
      <header className="App-header">
        <div id="helper" style={{ position: 'relative' }}>
          <canvas
            width={`${width}px`}
            height={`${height}px`}
            id="renderCanvas"
          />
        </div>
      </header>
    </div>
  );
}

export default App;
