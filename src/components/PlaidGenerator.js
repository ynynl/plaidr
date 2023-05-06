
import React, { useState, useEffect } from "react";
import generatePlaid from "../generator";
import { arrayToDataURL, getRandomItems, randomPivots } from "../utils";
import { ColorPicker, TwillPicker, SizePicker } from './Picker'
import ImageUploader from "./ImageUploader";

const PlaidGenerator = () => {
  const [image, setImage] = useState(null);
  const [plaidImage, setPlaidImage] = useState(null);
  const [plaidSettings, setPlaidSettings] = useState({
    colors: [],
    size: 128,
    twill: "tartan",
    pivots: []
  });
  const [numOfColor, setNumOfColor] = useState(5);
  const [rgbArray, setRgbArray] = useState([]);

  const initiatePlaid = (newRgbArray) => {
    setRgbArray(newRgbArray);
    setPlaidSettings({
      ...plaidSettings,
      colors: getRandomItems(newRgbArray, numOfColor),
      pivots: randomPivots(numOfColor-1)
    });
  }

  useEffect(() => {
    if (plaidSettings.colors.length > 0) {
      const plaid = generatePlaid(plaidSettings);
      const plaidImageData = arrayToDataURL(plaid);
      setPlaidImage(plaidImageData);
    }
  }, [plaidSettings]);

  return (
    <div>
      <ImageUploader
        setImage={setImage}
        initiatePlaid={initiatePlaid}
      />
      <ColorPicker
        rgbArray={rgbArray}
        numOfColor={numOfColor}
        setNumOfColor={setNumOfColor}
        setColors={(colors) => setPlaidSettings({...plaidSettings, colors})}
        setPivots={(pivots) => setPlaidSettings({...plaidSettings, pivots})}
      />
      <TwillPicker
        twill={plaidSettings.twill}
        setTwill={(twill) => setPlaidSettings({...plaidSettings, twill})}
      />
      <SizePicker
        size={plaidSettings.size}
        setSize={(size) => setPlaidSettings({...plaidSettings, size})}
      />
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

