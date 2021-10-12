import React from 'react';
import logo from './logo.svg';
import './App.css';
import { main } from './utils';
import { EditControl } from './control';
console.log(EditControl);
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => main()}>
          测试
        </button>
        <canvas width="600px" height="600px" id="renderCanvas"/>
      </header>
    </div>
  );
}

export default App;
