import React, { useState, useRef, useEffect, useCallback } from 'react';
import CanvasDraw from 'react-canvas-draw';
import './Create.css';
import NavBar from './NavBar';

const Create = () => {
  const canvasRef = useRef(null);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushRadius, setBrushRadius] = useState(4);
  const [tool, setTool] = useState('draw');
  const [showPopup, setShowPopup] = useState(false);
  const colors = [
    '#ffffff', '#ff0000', '#ffa500', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#800080', '#ff00ff', 
    '#000000', '#800000', '#ff4500', '#daa520', '#006400', '#008b8b', '#4682b4', '#4b0082', '#2e8b57', 
    '#d2691e', '#708090', '#9acd32', '#40e0d0'
  ];

  const handleFill = useCallback((event) => {
    if (tool !== 'fill') return;

    const canvas = canvasRef.current.canvas.drawing;
    const ctx = canvas.getContext('2d');
    const { offsetX, offsetY } = event;

    const hexToRgbA = (hex) => {
      let c;
      if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length=== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
      }
      throw new Error('Bad Hex');
    };

    const getColorAtPixel = (data, x, y) => {
      const offset = (y * canvas.width + x) * 4;
      return [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
    };

    const setColorAtPixel = (data, x, y, color) => {
      const offset = (y * canvas.width + x) * 4;
      const [r, g, b, a] = color.replace(/[^\d,]/g, '').split(',');
      data[offset] = r;
      data[offset + 1] = g;
      data[offset + 2] = b;
      data[offset + 3] = a;
    };

    const floodFill = (ctx, x, y, fillColor) => {
      const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      const data = imageData.data;
      const targetColor = getColorAtPixel(data, x, y);
      const compareColor = (color) => color.join(',') === targetColor.join(',');

      const stack = [[x, y]];
      while (stack.length) {
        const [sx, sy] = stack.pop();
        if (!compareColor(getColorAtPixel(data, sx, sy))) continue;

        let west = sx, east = sx;
        while (west >= 0 && compareColor(getColorAtPixel(data, west, sy))) west--;
        while (east < ctx.canvas.width && compareColor(getColorAtPixel(data, east, sy))) east++;

        for (let i = west + 1; i < east; i++) {
          setColorAtPixel(data, i, sy, fillColor);
          if (sy - 1 >= 0 && compareColor(getColorAtPixel(data, i, sy - 1))) stack.push([i, sy - 1]);
          if (sy + 1 < ctx.canvas.height && compareColor(getColorAtPixel(data, i, sy + 1))) stack.push([i, sy + 1]);
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    floodFill(ctx, offsetX, offsetY, hexToRgbA(brushColor));
  }, [tool, brushColor]);

  useEffect(() => {
    const canvas = canvasRef.current.canvas.drawing;
    canvas.addEventListener('click', handleFill);
    return () => canvas.removeEventListener('click', handleFill);
  }, [handleFill]);

  const saveDrawing = () => {
    const dataURL = canvasRef.current.getSaveData();
    let drawings = JSON.parse(localStorage.getItem('drawings')) || [];
    drawings.push(dataURL);
    localStorage.setItem('drawings', JSON.stringify(drawings));
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  const clearCanvas = () => {
    canvasRef.current.clear();
  };

  const handleColorChange = (color) => {
    setBrushColor(color);
    setTool('draw');
  };

  const handleRadiusChange = (size) => {
    setBrushRadius(size);
  };

  const handleToolChange = (selectedTool) => {
    setTool(selectedTool);
    if (selectedTool === 'eraser') {
      setBrushColor('#ffffff');
    } else {
      setBrushColor(brushColor);
    }
  };

  return (
    <div className="create">
      <NavBar />
      <div className="drawing-area">
        <div className="toolbar">
          <div className="selected-color" style={{ backgroundColor: brushColor }}></div>
          <div className="colors">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`color ${color === brushColor && tool === 'draw' ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              ></div>
            ))}
          </div>
          <div className="tools">
            <button className={`tool ${tool === 'draw' ? 'active' : ''}`} onClick={() => handleToolChange('draw')}><i className="fa-solid fa-pencil-alt"></i></button>
            <button className={`tool ${tool === 'fill' ? 'active' : ''}`} onClick={() => handleToolChange('fill')}><i className="fa-solid fa-fill-drip"></i></button>
            <button className={`tool ${tool === 'eraser' ? 'active' : ''}`} onClick={() => handleToolChange('eraser')}><i className="fa-solid fa-eraser"></i></button>
          </div>
          <div className="brush-sizes">
            <div className={`brush ${brushRadius === 2 ? 'active' : ''}`} onClick={() => handleRadiusChange(2)}></div>
            <div className={`brush ${brushRadius === 4 ? 'active' : ''}`} onClick={() => handleRadiusChange(4)}></div>
            <div className={`brush ${brushRadius === 6 ? 'active' : ''}`} onClick={() => handleRadiusChange(6)}></div>
            <div className={`brush ${brushRadius === 8 ? 'active' : ''}`} onClick={() => handleRadiusChange(8)}></div>
          </div>
          <div className="utility-buttons">
            <button className="utility-tool" onClick={clearCanvas}><i className="fa-solid fa-trash"></i></button>
            <button className="utility-tool" onClick={saveDrawing}><i className="fa-solid fa-save"></i></button>
          </div>
        </div>
        <div className="canvas-wrapper">
          <CanvasDraw
            className="canvas"
            ref={canvasRef}
            brushColor={brushColor}
            brushRadius={brushRadius}
            canvasWidth={380}
            canvasHeight={380}
            lazyRadius={0}
            style={{ backgroundColor: 'white' }}
          />
        </div>
      </div>
      {showPopup && <div className="popup">Drawing saved!</div>}
    </div>
  );
};

export default Create;
