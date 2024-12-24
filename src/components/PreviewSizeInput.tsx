import React from "react";
import './styles.css';

interface PreviewSizeInputProps {
  plaidWidth: number;
  plaidHeight: number;
  setPlaidWidth: (width: number) => void;
  setPlaidHeight: (height: number) => void;
}

const PreviewSizeInput: React.FC<PreviewSizeInputProps> = ({
  plaidWidth,
  plaidHeight,
  setPlaidWidth,
  setPlaidHeight,
}) => {
  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const width = Number(event.target.value);
    if (!isNaN(width)) {
      setPlaidWidth(width);
    }
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const height = Number(event.target.value);
    if (!isNaN(height)) {
      setPlaidHeight(height);
    }
  };

  return (
    <div className="input-container">
      <label htmlFor="width" className="input-label">Preview Size:</label>
      <input
        type="number"
        id="width"
        className="input-field"
        value={plaidWidth}
        onChange={handleWidthChange}
      />
      <span>×</span>
      <input
        type="number"
        id="height"
        className="input-field"
        value={plaidHeight}
        onChange={handleHeightChange}
      />
    </div>
  );
};

export default PreviewSizeInput; 