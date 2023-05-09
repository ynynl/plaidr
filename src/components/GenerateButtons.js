import React from "react";
import "./styles.css";

const GenerateButtons = ({
  getNewPivots,
  getNewColors,
  setPivotsAndColors,
}) => {
  const handleNewColor = () =>
    setPivotsAndColors({
      colors: getNewColors(),
    });

  const handleNewPivots = () =>
    setPivotsAndColors({
      pivots: getNewPivots(),
    });


  const handleNewPivotsAndColor = () =>
    setPivotsAndColors({
      colors: getNewColors(),
      pivots: getNewPivots(),
    });

  return (
    <div style={{ display: "flex", gap: 4 }}>
      <button onClick={handleNewPivots} className="btn">
        Shuffle Pattern
      </button>
      <button onClick={handleNewColor} className="btn">
        Shuffle Color
      </button>
      <button onClick={handleNewPivotsAndColor} className="btn">
        Shuffle Both
      </button>
    </div>
  );
};

export default GenerateButtons