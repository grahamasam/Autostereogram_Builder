import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

/*
canvas elements and functionality for drawing a depth map
*/

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(10);  // Default brush size
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [brushColor, setBrushColor] = useState('white');

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Calculate the coordinates for the center of the circle
    const centerX = e.nativeEvent.offsetX;
    const centerY = e.nativeEvent.offsetY;

    // Draw the circle
    context.beginPath();
    context.arc(centerX, centerY, brushSize, 0, 2 * Math.PI);
    context.fillStyle = brushColor; // Set fill color
    context.fill(); // Fill the circle
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.closePath();
    setIsDrawing(false);
  };

  const saveDrawing = () => {
    const fileName = window.prompt('Enter the name for your drawing:', 'drawing.png');
    if (fileName) {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      link.click();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleBrushSizeChange = (e) => {
    setBrushSize(e.target.value);
  };

  const handleColorChange = (color) => {
    setBrushColor(color);
  };

  return (
    <div>
      <div style={{ backgroundColor: '#f8ecc9', height: '90px', borderBottom: '2px solid #6b5344', marginBottom: '15px' }}>
        <div class="return-top-bar">
          <div style={{ marginTop: '10px', marginLeft: '15px', display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ marginRight: '10px' }}>
              <button className='return-bar-button'>Back to Home</button>
            </Link>
            <button className='return-bar-button' style={{ display: 'block', marginRight: '0' }} onClick={saveDrawing}>Save Drawing</button>
          </div>
        </div>
      </div>
      <div class="resizable-container">
        <div class="content">
          <div class="inner-content">
            <label style={{ marginRight: '10px' }}>
              Width:
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                style={{ marginLeft: '5px', width: '50px' }}
              />
            </label>
          </div>
          <div class="inner-content">
            <label style={{ marginRight: '10px' }}>
              Height:
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                style={{ marginLeft: '5px', width: '50px'  }}
              />
            </label>
          </div>
        </div>
        <div class="content">
          <div class="inner-content">
            <label>
              Brush Size: 
              <input 
                type="number" 
                value={brushSize} 
                onChange={handleBrushSizeChange} 
                min="1" 
                style={{ marginLeft: '10px', width: '50px' }}
              />
            </label>
          </div>
          <div class="inner-content" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button class="brush-color-button" style={{ '--button-color': brushColor, border: '2px solid #fed8d3' }}></button>
            <div style={{ width: '2px' }}></div>
            <button class="brush-color-button" style={{ '--button-color': 'white' }} onClick={() => handleColorChange('white')}></button>
            <button class="brush-color-button" style={{ '--button-color': 'grey' }} onClick={() => handleColorChange('grey')}></button>
            <button class="brush-color-button" style={{ '--button-color': 'black' }} onClick={() => handleColorChange('black')}></button>
          </div>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: '1px solid black' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default Canvas;
