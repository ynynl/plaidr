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
        min={2}
        max={30}
        value={numOfColor}
        onChange={handleNumOfColorChange}
      />
    </div>
  );
};

interface TwillPickerProps {
  twill: string;
  setTwill: (twill: string) => void;
}

export const TwillPicker: React.FC<TwillPickerProps> = ({ twill, setTwill }) => {
  const handleTwillChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTwill(event.target.value);
  };

  return (
    <div className="input-container">
      <label htmlFor="twill" className="input-label">Twill:</label>
      <input
        type="radio"
        id="tartan"
        name="twill"
        value="tartan"
        checked={twill === "tartan"}
        onChange={handleTwillChange}
      />
      <label htmlFor="tartan">Tartan</label>
      <input
        type="radio"
        id="net"
        name="twill"
        value="net"
        checked={twill === "net"}
        onChange={handleTwillChange}
      />
      <label htmlFor="net">Net</label>
      <input
        type="radio"
        id="madras"
        name="twill"
        value="madras"
        checked={twill === "madras"}
        onChange={handleTwillChange}
      />
      <label htmlFor="madras">Madras</label>
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