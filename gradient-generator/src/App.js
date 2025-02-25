import React, { useState, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';

const presets = [
  {
    name: 'Sunrise',
    angle: 45,
    stops: [
      { id: 1, color: '#ff6b6b', position: 0 },
      { id: 2, color: '#ffd93d', position: 100 },
    ],
  },
  {
    name: 'Ocean',
    angle: 180,
    stops: [
      { id: 1, color: '#00b4d8', position: 0 },
      { id: 2, color: '#0077b6', position: 100 },
    ],
  },
  {
    name: 'Mint',
    angle: 120,
    stops: [
      { id: 1, color: '#c0fdfb', position: 0 },
      { id: 2, color: '#7efbd3', position: 100 },
    ],
  },
];

const initialStops = [
  { id: 1, color: '#ffffff', position: 0 },
  { id: 2, color: '#000000', position: 100 },
];

function App() {
  const [colorStops, setColorStops] = useState(initialStops);
  const [angle, setAngle] = useState(90);
  const [activePicker, setActivePicker] = useState(null);
  const gradientPreviewRef = useRef(null);

  const sortedStops = colorStops; // No sorting here!

  const gradientStyle = {
    background: `linear-gradient(${angle}deg, ${sortedStops
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ')})`,
  };

  const handleAddColor = (e) => {
    const rect = gradientPreviewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = Math.round((x / rect.width) * 100);
    
    const newStop = {
      id: Date.now(),
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      position,
    };

    setColorStops([...colorStops, newStop]);
    setColorStops(prevStops => [...prevStops].sort((a, b) => a.position - b.position))
  };

  const handleColorChange = (id, color) => {
    setColorStops(colorStops.map(stop => 
      stop.id === id ? { ...stop, color } : stop
    ));
  };

  const handlePositionChange = (id, position) => {
    setColorStops(prevStops =>
      prevStops.map(stop =>
        stop.id === id ? { ...stop, position: Number(position) } : stop
      )
    );
  };  

  const handleDelete = (id) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter(stop => stop.id !== id));
    }
  };

  const applyPreset = (preset) => {
    setColorStops(preset.stops);
    setAngle(preset.angle);
    setActivePicker(null);
  };

  const copyCSS = () => {
    const css = `background: ${gradientStyle.background};`;
    navigator.clipboard.writeText(css);
  }

  return (
    <>
      <div className="flex gap-3 bg-white/30 backdrop-blur-md shadow-md p-2 sticky top-0 z-10">
        <img src="logo.png" alt="logo" className="w-10 h-10 z-100" />
        <a href='https://gradient-generator-1f9hld24l-arhammurtazas-projects.vercel.app/' className="text-3xl text-gray z-100">Gradient Generator</a>
      </div>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-3 gap-2 max-w-6xl mx-auto space-y-4">
          {/* Gradient Preview */}
          <div
            ref={gradientPreviewRef}
            className="h-64 rounded-xl shadow-lg cursor-crosshair relative"
            style={gradientStyle}
            onClick={handleAddColor}
          >
            <div className="absolute bottom-4 left-4 bg-white/80 px-3 py-1 rounded text-sm">
              Click to add color stop
            </div>
          </div>

          {/* CSS Output */}
          <div className="col-start-1 row-start-2 gap-4 bg-white p-6 rounded-lg shadow flex flex-col items-center">
            <textarea
              value={`background: ${gradientStyle.background};`}
              readOnly
              className="w-full p-3 bg-gray-50 rounded font-mono text-sm focus:outline-none resize-none h-24"
              rows="3"
            />
            <button className="w-20 mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:scale-105 active:bg-blue-700 active:scale-95 transition duration-150 ease-in-out hover:pointer cursor-pointer" onClick={copyCSS}>Copy</button>
          </div>

          {/* Controls */}
          <div className="col-start-1 row-start-3 md:col-start-2 md:row-span-3 bg-white p-6 rounded-lg shadow space-y-6">
            {/* Angle Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Angle: {angle}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Color Stops */}
            <div className="space-y-4">
              {sortedStops.map((stop) => (
                <div key={stop.id} className="flex items-center gap-4">
                  <div className="relative">
                    <button
                      onClick={() => setActivePicker(activePicker === stop.id ? null : stop.id)}
                      className="w-10 h-10 rounded-3xl border-2 border-white shadow hover:pointer cursor-pointer"
                      style={{ backgroundColor: stop.color }}
                    />
                    {activePicker === stop.id && (
                      <div className="absolute z-10 mt-2">
                        <HexColorPicker
                          color={stop.color}
                          onChange={(color) => handleColorChange(stop.id, color)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) => handlePositionChange(stop.id, e.target.value)}
                    onMouseUp={() => setColorStops(prevStops => [...prevStops].sort((a, b) => a.position - b.position))}
                    className="w-full"
                  />
                  </div>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={stop.position}
                    onChange={(e) => {handlePositionChange(stop.id, e.target.value)
                      setColorStops(prevStops => [...prevStops].sort((a, b) => a.position - b.position))
                    }}
                    className="w-16 px-2 py-1 border rounded text-sm"
                  />

                  <button
                    onClick={() => handleDelete(stop.id)}
                    disabled={colorStops.length <= 2}
                    className="px-3 text-sm py-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-0 disabled:pointer-events-none hover:pointer cursor-pointer hover:scale-105 active:scale-95 transition duration-150 ease-in-out"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="col-start-1 row-start-4 md:row-start-3 bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Presets</h3>
            <div className="grid grid-cols-3 gap-4">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="h-16 rounded-lg shadow-sm hover:shadow transition-shadow"
                  style={{
                    background: `linear-gradient(${preset.angle}deg, ${preset.stops
                      .map(stop => `${stop.color} ${stop.position}%`)
                      .join(', ')})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;