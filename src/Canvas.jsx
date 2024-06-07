import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/*
canvas elements and functionality for drawing a depth map
*/

const Canvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(2);  // Default brush size
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);

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
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.strokeStyle = 'white';
    context.lineWidth = brushSize;
    context.stroke();
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

  return (
    <div style={{ margin: '15px'}}>
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ marginRight: '10px' }}>
          <button>Back to Home</button>
        </Link>
        <button style={{ display: 'block', marginRight: '0' }} onClick={saveDrawing}>Save Drawing</button>
      </div >
      <hr style={{ margin: '10px 0' }} />
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px' }}>
          Width:
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
            style={{ marginLeft: '5px', marginRight: '20px' }}
          />
        </label>
        <label style={{ marginRight: '10px' }}>
          Height:
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            style={{ marginLeft: '5px' }}
          />
        </label>
      </div>
      <div>
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
