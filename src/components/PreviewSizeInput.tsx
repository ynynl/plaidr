import React from "react";
import "./styles.css";

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
  return (
    <div className="input-container">
      <label htmlFor="width" className="input-label">Preview Size</label>
      <div className="preview-size-input">
        <input
          type="number"
          id="width"
          name="width"
          min={50}
          max={2000}
          value={plaidWidth}
          onChange={(e) => setPlaidWidth(Number(e.target.value))}
        />
        <span>×</span>
        <input
          type="number"
          id="height"
          name="height"
          min={50}
          max={2000}
          value={plaidHeight}
          onChange={(e) => setPlaidHeight(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default PreviewSizeInput; 