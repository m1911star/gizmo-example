import React from 'react';
import './App.css';
import {main} from './utils';

function App() {
    React.useLayoutEffect(() => {
        const { orientation, scene } = main();
        document.getElementById('main')?.appendChild(orientation);
        orientation.onAxisSelected = (axis) => {
            console.log(axis);
        }
        function animate() {
            requestAnimationFrame(animate);
            orientation.update();
        }

        animate();
    }, []);
    return (
        <div className="App">
            <header className="App-header">
                <div style={{ position: 'relative'}} id="main">
                    <canvas width="600px" height="600px" id="renderCanvas"/>
                </div>
            </header>
        </div>
    );
}

export default App;
