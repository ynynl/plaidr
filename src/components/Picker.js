import React from "react";

export const ColorPicker = ({ numOfColor, handleNewNumOfColor }) => {
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
        min="2"
        max="30"
        value={numOfColor}
        onChange={handleNumOfColorChange}
      />
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
    const newSize = Math.pow(2, Number(event.target.value));
    setSize(newSize);
  };

  return (
    <div>
      <label htmlFor="size">Size {Math.log2(size)} </label>
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
