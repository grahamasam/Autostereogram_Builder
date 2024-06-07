import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Canvas from './Canvas';
import './App.css';
import StereogramStage from './StereogramStage';

const Home = () => (
  <div className="my_funny_css">
    <div className="sidebar">
      <Link to="/canvas">
        <button>Draw Depth Map</button>
      </Link>
      <Link to="/stereogram_stage">
        <button>Create Stereogram</button>
      </Link>
    </div>
  </div>
  
);

const CanvasScreen = () => (
  <div>
    <Canvas />
  </div>
);

const StereogramStageScreen = () => (
  <div>
    <StereogramStage />
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/canvas" element={<CanvasScreen />} />
          <Route path="/stereogram_stage" element={<StereogramStageScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
