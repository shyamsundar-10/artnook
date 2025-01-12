import React, { useState, useEffect, useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import "./Explore.css";
import NavBar from "./NavBar";

const Explore = () => {
  const [savedDrawings, setSavedDrawings] = useState([]);
  const canvasRefs = useRef([]);

  useEffect(() => {
    const drawings = JSON.parse(localStorage.getItem("drawings")) || [];
    setSavedDrawings(drawings);
  }, []);

  const handleDownload = (index) => {
    const canvas = canvasRefs.current[index].canvas.drawing;
    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "artnook.png";
    a.click();
  };

  const handleDelete = (index) => {
    const updatedDrawings = savedDrawings.filter((_, i) => i !== index);
    setSavedDrawings(updatedDrawings);
    localStorage.setItem("drawings", JSON.stringify(updatedDrawings));
  };

  return (
    <div className="explore">
      <NavBar/>
      <div className="gallery">
        {savedDrawings.length > 0 ? (
          savedDrawings.map((drawing, index) => (
            <div key={index} className="drawing-wrapper">
              <CanvasDraw
                ref={(el) => (canvasRefs.current[index] = el)}
                disabled
                saveData={drawing}
              />
              <div className="drawing-buttons">
                <button
                  onClick={() => handleDownload(index)}
                  className="download-button"
                >
                  <i className="fa fa-download"></i>
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="delete-button"
                >
                  <i className="fa fa-trash"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <h1>No drawings saved yet.</h1>
        )}
      </div>
    </div>
  );
};

export default Explore;
