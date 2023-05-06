import React, { useState, useEffect } from "react";
import generatePlaid from "../utils/generator";
import { arrayToDataURL, getRandomItems, randomPivots } from "../utils/utils";
import {
  ColorPicker,
  TwillPicker,
  SizePicker,
  GenerateButtons,
} from "./Picker";
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

  const getNewPivots = (currNumOfColor = numOfColor) =>
    randomPivots(currNumOfColor - 1);
  const getNewColors = (currNumOfColor = numOfColor, cuurRgbArray = rgbArray) =>
    getRandomItems(cuurRgbArray, currNumOfColor);

  const handleNewRgbArray = (newRgbArray) => {
    setRgbArray(newRgbArray);
    setPlaidSettings({
      ...plaidSettings,
      colors: getNewColors(numOfColor, newRgbArray),
      pivots: getNewPivots(),
    });
  };

  const handleNewNumOfColor = (newNumOfColor) => {
    setNumOfColor(newNumOfColor);
    setPlaidSettings({
      ...plaidSettings,
      pivots: getNewPivots(newNumOfColor),
      colors: getNewColors(newNumOfColor),
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
      />
      <GenerateButtons
        pivots={plaidSettings.pivots}
        getNewPivots={getNewPivots}
        colors={plaidSettings.colors}
        getNewColors={getNewColors}
        setPivotsAndColors={(pivotsAndColors) =>
          setPlaidSettings({ ...plaidSettings, ...pivotsAndColors })
        }
      />
      {image && (
        <img
          src={image}
          alt="uploaded"
          style={{ width: "300px", height: "300px", objectFit: "cover" }}
        />
      )}
      <ImageUploader
        setImage={setImage}
        handleNewRgbArray={handleNewRgbArray}
      />

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
