import React from "react";
import "./styles.css";

interface GenerateButtonsProps {
  getNewPivots: () => number[][];
  getNewColors: () => number[][];
  setPivotsAndColors: (settings: { colors?: number[][], pivots?: number[][] }) => void;
  hasColors: boolean;
}

const GenerateButtons: React.FC<GenerateButtonsProps> = ({
  getNewPivots,
  getNewColors,
  setPivotsAndColors,
  hasColors
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
    <div className="preview-generate-btns">
      <button onClick={handleNewPivots} className="btn">
        Shuffle Pattern
      </button>
      <button onClick={handleNewColor} className="btn" disabled={!hasColors}>
        Shuffle Color
      </button>
      <button onClick={handleNewPivotsAndColor} className="btn" disabled={!hasColors}>
        Shuffle Both
      </button>
    </div>
  );
};

export default GenerateButtons; 