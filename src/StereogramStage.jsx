import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/tauri';
import './App.css';

const StereogramStage = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [stereogramSrc, setStereogramSrc] = useState('');
  const [slices, setSlices] = useState(6);
  const [depthMapFile, setDepthMapFile] = useState(null);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);

  const handleGenerateRandom = async () => {
    const slice_width = parseInt(width / slices);
    const base64Image = await invoke('generate_random_repeat', { width: slice_width, height });
    setImageSrc(`data:image/png;base64,${base64Image}`);
  };

  const handleUseDepthMap = async () => {
    const depthMapInput = document.getElementById('depthMapInput');
    depthMapInput.click(); // Trigger click on the hidden file input
  };

  const handleDepthMapChange = async (event) => {
    const file = event.target.files[0];
    setDepthMapFile(file);

    // Read the dimensions of the depth map file
    const image = new Image();
    image.onload = function() {
      setWidth(image.width);
      setHeight(image.height);
    };
    image.src = URL.createObjectURL(file);
  };

  const handleGenerateStereogram = async () => {
    const reader = new FileReader();
    reader.onload = async () => {
      const base64DepthMap = reader.result.split(',')[1];
      const base64Image = imageSrc.split(',')[1];
      const result = await invoke('generate_stereogram', {
        slices,
        imageSrc: base64Image,
        depthMap: base64DepthMap
      });
      setStereogramSrc(`data:image/png;base64,${result}`);
    };
    reader.readAsDataURL(depthMapFile);
  };

  return (
    <div>
      <div style={{ backgroundColor: '#f8ecc9', height: '90px', borderBottom: '2px solid #6b5344', marginBottom: '15px' }}>
        <div class="return-top-bar">
          <div style={{ position: 'relative', top: '10px', left: '15px', display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ marginRight: '10px' }}>
              <button className='return-bar-button'>Back to Home</button>
            </Link>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <button onClick={handleUseDepthMap}>Use Depth Map</button>
        <button onClick={handleGenerateRandom}>Generate Random</button>
        <button onClick={handleGenerateStereogram}>Generate Stereogram</button>
      </div>
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px' }}>
          Slices:
          <input
            type="number"
            value={slices}
            onChange={(e) => setSlices(parseInt(e.target.value))}
            style={{ marginLeft: '5px' }}
          />
        </label>
      </div>
      <hr style={{ margin: '10px 0' }} />
      <input type="file" id="depthMapInput" style={{ display: 'none' }} accept=".png, .jpg, .jpeg" onChange={handleDepthMapChange} />
      <div style={{
        position: 'relative',
        height: `${height}px`,
        width: `${width}px`,
        border: '1px solid black'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: `100%`, height: '100%', opacity: 0.5 }}>
          {depthMapFile && (
            <>
              {console.log('Depth map URL:', URL.createObjectURL(depthMapFile))}
              <img src={URL.createObjectURL(depthMapFile)} alt="Depth Map" style={{ width: '100%', height: '100%' }} />
            </>
          )}
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <div style={{ display: 'flex', height: '100%', width: '100%', opacity: 0.8 }}>
            <div style={{ flex: 1, backgroundColor: 'white', borderRight: '1px solid black' }}>
              {imageSrc && <img src={imageSrc} alt="Generated" style={{ width: '100%', height: '100%' }} />}
            </div>
            {[...Array(slices - 1)].map((_, index) => (
              <div key={index} style={{ flex: 1, backgroundColor: 'grey', borderRight: '1px solid black' }}></div>
            ))}
          </div>
        </div>
      </div>
      <hr style={{ margin: '10px 0' }} />
      {stereogramSrc && (
        <div style={{
          height: `${height}px`,
          width: `${width}px`,
          border: '1px solid black'
        }}>
          <img src={stereogramSrc} alt="Stereogram" style={{ width: '100%', height: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default StereogramStage;
