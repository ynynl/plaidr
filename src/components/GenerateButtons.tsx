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
        <svg className="shuffle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Pattern
      </button>
      <button onClick={handleNewColor} className="btn" disabled={!hasColors}>
        <svg className="shuffle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Color
      </button>
      <button onClick={handleNewPivotsAndColor} className="btn btn--both" disabled={!hasColors}>
        <svg className="shuffle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Shuffle
      </button>
    </div>
  );
};

export default GenerateButtons; 