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
  const [hasRandom, setHasRandom] = useState(false);
  const [hasStereogram, setHasStereogram] = useState(false);

  const handleGenerateRandom = async () => {
    setHasRandom(true);
    const slice_width = parseInt(width / slices);
    const base64Image = await invoke('generate_random_repeat', { width: slice_width, height });
    setImageSrc(`data:image/png;base64,${base64Image}`);
    setHasRandom(true);
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
    if (!hasRandom) return;
    /* TODO: ALSO SHOULD THROW UP WARNING IF FALSE */

    setHasStereogram(true);

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

  const saveStereogram = () => {
    if (!hasStereogram) return;
    /* TODO: GIVE WARNING THAT STEREOGRAM MUST BE CREATED FIRST */

    const fileName = window.prompt('Enter the name for your autotereogram:', 'autostereogram.png');
    if (fileName) {
      // Get the base64-encoded image data from state or props
      const base64Image = stereogramSrc.split(',')[1]; // Extract only the base64 string
      
      // Convert base64 to blob
      const byteCharacters = atob(base64Image);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      // Create a link element, simulate click to trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <div style={{ backgroundColor: '#f8ecc9', height: '90px', borderBottom: '2px solid #6b5344', marginBottom: '15px' }}>
        <div class="return-top-bar">
          <div style={{ position: 'relative', top: '10px', left: '15px', display: 'flex', alignItems: 'center', width: 'calc(100% - 15px)' }}>
            <Link to="/" style={{ marginRight: '10px' }}>
              <button className='return-bar-button'>Back to Home</button>
            </Link>
            <button className='return-bar-button' onClick={saveStereogram}>Save Stereogram</button>
          </div>
        </div>
      </div>
      <div className="resizable-container">
        <div className="content">
          <div className="inner-content">
            <button onClick={handleGenerateRandom}>Generate Random</button>
          </div>
          <div className='inner-content'>
            <button onClick={handleGenerateStereogram}>Generate Stereogram</button>
          </div>
        </div>
        <div className="content">
          <div className='inner-content'>
            <label style={{ marginRight: '10px' }}>
              Slices:
              <input
                type="number"
                value={slices}
                onChange={(e) => {
                  setSlices(e.target.value);
                  setHasRandom(false);
                }}
                style={{ marginLeft: '5px', width: '50px' }}
              />
            </label>
          </div>
          <div className='inner-content'>
            <button onClick={handleUseDepthMap}>Use Depth Map</button>
          </div>
        </div>
      </div>
      <input type="file" id="depthMapInput" style={{ display: 'none' }} accept=".png, .jpg, .jpeg" onChange={handleDepthMapChange} />
      <div style={{
        position: 'relative',
        height: `${height}px`,
        width: `${width}px`,
        border: '2px solid #6b5344',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto', // Center the container horizontally
        marginTop: '15px'
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
            <div style={{ flex: 1, backgroundColor: 'white' }}>
              {imageSrc && <img src={imageSrc} alt="Generated" style={{ width: '100%', height: '100%' }} />}
            </div>
            {[...Array(slices - 1)].map((_, index) => (
              <div key={index} style={{ flex: 1, backgroundColor: 'grey', borderLeft: '1px solid black' }}></div>
            ))}
          </div>
        </div>
      </div>
      <hr></hr>
      {stereogramSrc && (
        <div style={{
          height: `${height}px`,
          width: `${width}px`,
          border: '2px solid #6b5344',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto', // Center the container horizontally
          marginBottom: '15px'
        }}>
          <img src={stereogramSrc} alt="Stereogram" style={{ width: '100%', height: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default StereogramStage;
