import React from "react";
import { getRandomPivots, sortPairsByDistance } from "../utils/utils";
import { PlaidSettings } from "../types";

interface ColorPickerProps {
  numOfColor: number;
  setNumOfColor: (num: number) => void;
  setPlaidSettings: (settings: PlaidSettings | ((prev: PlaidSettings) => PlaidSettings)) => void;
  getNewColors: (numOfColor?: number) => number[][];
  disabled: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  numOfColor,
  setNumOfColor,
  setPlaidSettings,
  getNewColors,
  disabled
}) => {
  const handleNumOfColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNumOfColor = Number(event.target.value);
    const numToChange = newNumOfColor - numOfColor;
    setPlaidSettings((plaidSettings) => {
      let newPivots: number[][], newColors: number[][];
      if (newNumOfColor > numOfColor) {
        newPivots = sortPairsByDistance(
          plaidSettings.pivots.concat(getRandomPivots(numToChange))
        );
        newColors = plaidSettings.colors.concat(getNewColors(numToChange));
      } else {
        newPivots = [...plaidSettings.pivots].slice(0, newNumOfColor - 1);
        newColors = [...plaidSettings.colors].slice(0, newNumOfColor);
      }
      return {
        ...plaidSettings,
        pivots: newPivots,
        colors: newColors,
      };
    });
    setNumOfColor(newNumOfColor);
  };

  return (
    <div className="input-container">
      <label htmlFor="numOfColor" className="input-label">Bands:</label>
      <input
        disabled={disabled}
        type="range"
        id="numOfColor"
        name="numOfColor"
        min={4}
        max={60}
        value={numOfColor}
        onChange={handleNumOfColorChange}
      />
    </div>
  );
};

interface TwillPickerProps {
  twill: 'tartan' | 'madras' | 'net';
  setTwill: (twill: 'tartan' | 'madras' | 'net') => void;
}

export const TwillPicker: React.FC<TwillPickerProps> = ({ twill, setTwill }) => {
  const handleTwillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTwill(event.target.value as 'tartan' | 'madras' | 'net');
  };

  return (
    <div className="input-container">
      <label className="input-label">Twill</label>
      <div className="radio-group">
        {[
          { value: 'tartan', label: 'Tartan' },
          { value: 'net', label: 'Net' },
          { value: 'madras', label: 'Madras' }
        ].map((option) => (
          <div key={option.value}>
            <input
              type="radio"
              id={option.value}
              name="twill"
              value={option.value}
              checked={twill === option.value}
              onChange={handleTwillChange}
            />
            <label className="radio-label" htmlFor={option.value}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SizePickerProps {
  size: number;
  setSize: (size: number) => void;
}

export const SizePicker: React.FC<SizePickerProps> = ({ size, setSize }) => {
  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Math.pow(2, Number(event.target.value));
    setSize(newSize);
  };

  return (
    <div className="input-container">
      <label htmlFor="size" className="input-label">Pattern Size </label>
      <input
        type="range"
        id="size"
        name="size"
        min={3}
        max={8}
        value={Math.log2(size)}
        onChange={handleSizeChange}
      />
    </div>
  );
}; 