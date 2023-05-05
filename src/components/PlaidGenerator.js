
import React, { useState, useEffect } from "react";
import generatePlaid from "../generator";
import { arrayToDataURL, getRandomItems, randomPivots } from "../utils";
import { ColorPicker, TwillPicker, SizePicker } from './Picker'
import ImageUploader from "./ImageUploader";

const PlaidGenerator = () => {
  const [image, setImage] = useState(null);
  const [plaidImage, setPlaidImage] = useState(null);
  const [numOfColor, setNumOfColor] = useState(5);
  const [twill, setTwill] = useState("tartan");
  const [rgbArray, setRgbArray] = useState([]);
  const [size, setSize] = useState(128);
  const [colors, setColors] = useState([]);
  const [pivots, setPivots] = useState([]);

  const initiatePlaid = (newRgbArray) => {
    setRgbArray(newRgbArray);
    setColors(getRandomItems(newRgbArray, 5));
    setPivots(randomPivots(4));
    setNumOfColor(5);
  }

  useEffect(() => {
    if (rgbArray.length > 0) {
      const plaid = generatePlaid({
        colors,
        size,
        twill,
        pivots,
      });
      const plaidImageData = arrayToDataURL(plaid);
      setPlaidImage(plaidImageData);
    }
  }, [colors, pivots, rgbArray, size, twill]);

  return (
    <div>
      <ImageUploader
        setImage={setImage}
        initiatePlaid={initiatePlaid}
      />
      <ColorPicker rgbArray={rgbArray} numOfColor={numOfColor} setColors={setColors} setPivots={setPivots} setNumOfColor={setNumOfColor} />
      <TwillPicker twill={twill} setTwill={setTwill} />
      <SizePicker size={size} setSize={setSize} />
      {image && <img src={image} alt="uploaded" style={{ width: "300px", height: "300px", objectFit: "cover" }} />}
      {plaidImage && (
        <img
          src={plaidImage}
          alt="generated tartan"
          style={{ width: "300px", height: "300px" }}
        />
      )}
    </div>
  );
};

export default PlaidGenerator;

