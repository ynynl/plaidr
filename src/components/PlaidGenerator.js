import React, { useState, useEffect } from "react";
import generatePlaid from "../utils/generator";
import { arrayToDataURL, getRandomItems, randomPivots } from "../utils/utils";
import {
  ColorPicker,
  TwillPicker,
  SizePicker,
} from "./Picker";
import GenerateButtons from "./GenerateButtons";
import ImageUploader from "./ImageUploader";
import './styles.css';

const ImagePreview = ({ image, onClick }) => {
  return (
    <img
      src={image}
      alt="preview"
      className="preview"
      onClick={onClick}
    />
  );
};

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
  const [showOverlay, setShowOverlay] = useState(false); // new state variable

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
    <>
      <div className="container">
        <ImageUploader
          setImage={setImage}
          handleNewRgbArray={handleNewRgbArray}
        />
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
          getNewPivots={getNewPivots}
          getNewColors={getNewColors}
          setPivotsAndColors={(pivotsAndColors) =>
            setPlaidSettings({ ...plaidSettings, ...pivotsAndColors })
          }
        />
        {!!image && <ImagePreview image={image} />}
        {!!plaidImage && <ImagePreview image={plaidImage} onClick={() => setShowOverlay(true)}/>}
      </div>
      {showOverlay && <div
        className="full-screen-overlay"
        onClick={() => setShowOverlay(false)}
        style={{
          backgroundImage: `url(${plaidImage})`,
        }} />}
    </>
  );
};

export default PlaidGenerator;

