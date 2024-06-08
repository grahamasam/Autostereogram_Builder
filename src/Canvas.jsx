import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(10);  // Default brush size
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [brushColor, setBrushColor] = useState('white');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

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

  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div>
      <div style={{ backgroundColor: '#f8ecc9', height: '90px', borderBottom: '2px solid #6b5344', marginBottom: '15px' }}>
        <div className="return-top-bar">
          <div style={{ position: 'relative', top: '10px', left: '15px', display: 'flex', alignItems: 'center', width: 'calc(100% - 15px)' }}>
            <Link to="/" style={{ marginRight: '10px' }}>
              <button className='return-bar-button'>Back to Home</button>
            </Link>
            <button className='return-bar-button' onClick={saveDrawing}>Save Drawing</button>
          </div>
        </div>
      </div>
      <div className="resizable-container">
        <div className="content">
          <div className="inner-content">
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
          <div className="inner-content">
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
        <div className="content">
          <div className="inner-content">
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
          <div className="inner-content" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="brush-color-button" style={{ '--button-color': brushColor, border: '2px solid #fed8d3' }}></button>
            <div style={{ width: '2px' }}></div>
            <button className="brush-color-button" style={{ '--button-color': 'white' }} onClick={() => handleColorChange('white')}></button>
            <button className="brush-color-button" style={{ '--button-color': 'grey' }} onClick={() => handleColorChange('grey')}></button>
            <button className="brush-color-button" style={{ '--button-color': 'black' }} onClick={() => handleColorChange('black')}></button>
          </div>
        </div>
      </div>
      
      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ border: '2px solid #6b5344', cursor: 'crosshair' }}
          onMouseDown={startDrawing}
          onMouseMove={(e) => {
            draw(e);
            handleMouseMove(e);
          }}
          onMouseUp={stopDrawing}
          onMouseLeave={() => {
            stopDrawing();
            handleMouseLeave();
          }}
          onMouseEnter={handleMouseEnter}
        />
        {isHovering && (
          <div
            style={{
              position: 'absolute',
              left: mousePosition.x - brushSize,
              top: mousePosition.y - brushSize - 237,
              width: brushSize * 2,
              height: brushSize * 2,
              borderRadius: '50%',
              backgroundColor: brushColor,
              pointerEvents: 'none',
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
