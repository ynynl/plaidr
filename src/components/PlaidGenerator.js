import React, { useState, useEffect } from "react";
import generatePlaid from "../utils/generator";
import { arrayToDataURL, getRandomItems, randomPivots } from "../utils/utils";
import { ColorPicker, TwillPicker, SizePicker } from "./Picker";
import ImageUploader from "./ImageUploader";

const PlaidGenerator = () => {
  const [image, setImage] = useState(null);
  const [plaidImage, setPlaidImage] = useState(null);
  const [plaidSettings, setPlaidSettings] = useState({
    colors: [],
    size: 128,
    twill: "tartan",
    pivots: [],
  });
  const [numOfColor, setNumOfColor] = useState(5);
  const [rgbArray, setRgbArray] = useState([]);

  const handleNewRgbArray = (newRgbArray) => {
    setRgbArray(newRgbArray);
    setPlaidSettings({
      ...plaidSettings,
      colors: getRandomItems(newRgbArray, numOfColor),
      pivots: randomPivots(numOfColor - 1),
    });
  };

  const handleNewNumOfColor = (newNumOfColor) => {
    setNumOfColor(newNumOfColor);
    setPlaidSettings({
      ...plaidSettings,
      pivots: randomPivots(newNumOfColor - 1),
      colors: getRandomItems(rgbArray, newNumOfColor),
    });
  };

  useEffect(() => {
    if (plaidSettings.colors.length > 0) {
      const plaid = generatePlaid(plaidSettings);
      const plaidImageData = arrayToDataURL(plaid);
      setPlaidImage(plaidImageData);
    }
  }, [plaidSettings]);

  return (
    <div>
      <ImageUploader setImage={setImage} handleNewRgbArray={handleNewRgbArray} />
      <TwillPicker
        twill={plaidSettings.twill}
        setTwill={(twill) => setPlaidSettings({ ...plaidSettings, twill })}
      />
      <SizePicker
        size={plaidSettings.size}
        setSize={(size) => setPlaidSettings({ ...plaidSettings, size })}
      />
      <ColorPicker
        numOfColor={numOfColor}
        handleNewNumOfColor={handleNewNumOfColor}
        handleNewColor={() =>
          setPlaidSettings({
            ...plaidSettings,
            colors: getRandomItems(rgbArray, numOfColor),
          })
        }
        handleNewPivots={() =>
          setPlaidSettings({
            ...plaidSettings,
            pivots: randomPivots(numOfColor - 1),
          })
        }
      />
      {image && (
        <img
          src={image}
          alt="uploaded"
          style={{ width: "300px", height: "300px", objectFit: "cover" }}
        />
      )}
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
