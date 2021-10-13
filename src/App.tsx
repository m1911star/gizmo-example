import React from 'react';
import logo from './logo.svg';
import './App.css';
import { main } from './utils';
import { EditControl } from './control';
function App() {
  React.useLayoutEffect(() => {
    main();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <canvas width="600px" height="600px" id="renderCanvas"/>
      </header>
    </div>
  );
}

export default App;
