import React from "react";

export const ColorPicker = ({
  numOfColor,
  handleNewColor,
  handleNewPivots,
  handleNewNumOfColor,
}) => {
  const handleNumOfColorChange = (event) => {
    const newNumOfColor = event.target.value;
    handleNewNumOfColor(newNumOfColor);
  };

  return (
    <div>
      <label htmlFor="numOfColor">Number of Colors:</label>
      <input
        type="range"
        id="numOfColor"
        name="numOfColor"
        min="3"
        max="20"
        value={numOfColor}
        onChange={handleNumOfColorChange}
      />
      <div>
        <button onClick={handleNewPivots}>Generate New Pivots</button>
      </div>
      <div>
        <button onClick={handleNewColor}>Generate New Colors</button>
      </div>
    </div>
  );
};

export const TwillPicker = ({ twill, setTwill }) => {
  const handleTwillChange = (event) => {
    setTwill(event.target.value);
  };

  return (
    <div>
      <label htmlFor="twill">Twill:</label>
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

export const SizePicker = ({ size, setSize }) => {
  const handleSizeChange = (event) => {
    setSize(Number(event.target.value));
  };

  return (
    <div>
      <label htmlFor="size">Size: {size} </label>
      <input
        type="range"
        id="size"
        name="size"
        min={64}
        max={512}
        step={64}
        value={size}
        onChange={handleSizeChange}
      />
    </div>
  );
};
