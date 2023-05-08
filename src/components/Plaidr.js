import React, { useState, useMemo, useCallback } from "react";
import generatePlaid from "../utils/plaid";
import { rgbArrayToPatternCanvas, getRandomItems, getRandomPivots, createSizedCanvas } from "../utils/utils";
import {
  ColorPicker,
  TwillPicker,
  SizePicker,
} from "./Picker";
import GenerateButtons from "./GenerateButtons";
import ImageUploader from "./ImageUploader";
import './styles.css';

const Plaidr = () => {
  const [image, setImage] = useState(null);
  const [imageArray, setImageArray] = useState([]);
  const [plaidSettings, setPlaidSettings] = useState({
    colors: [],
    size: 128,
    twill: "tartan",
    pivots: [],
  });
  const [numOfColor, setNumOfColor] = useState(5);
  const [showOverlay, setShowOverlay] = useState(false); // new state variable
  const [isLoading, setIsLoading] = useState(false);

  const getNewPivots = useCallback((currNumOfColor = numOfColor) =>
    getRandomPivots(currNumOfColor - 1), [numOfColor]);

  const getNewColors = useCallback((currNumOfColor = numOfColor, cuurRgbArray = imageArray) =>
    getRandomItems(cuurRgbArray, currNumOfColor), [imageArray, numOfColor]);

  const handleNewRgbArray = useCallback((newRgbArray) => {
    setImageArray(newRgbArray);
    setPlaidSettings({
      ...plaidSettings,
      colors: getNewColors(numOfColor, newRgbArray),
      pivots: getNewPivots(),
    });
    setIsLoading(false)
  }, [getNewColors, getNewPivots, numOfColor, plaidSettings]);

  const handleNewNumOfColor = useCallback((newNumOfColor, numOfColor) => {
    let newPivots, newColors
    const numToRemove = Math.abs(newNumOfColor - numOfColor)
    if (newNumOfColor > numOfColor) {
      newPivots = plaidSettings.pivots.concat(getRandomPivots(numToRemove));
      newColors = plaidSettings.colors.concat(getNewColors(numToRemove));
    }
    else {
      newPivots = plaidSettings.pivots.slice(0, -numToRemove)
      newColors = plaidSettings.colors.slice(0, -numToRemove)
    }
    console.log(newPivots.length);
    console.log(newColors.length);
    setPlaidSettings({
      ...plaidSettings,
      pivots: newPivots,
      colors: newColors,
    });
    setNumOfColor(newNumOfColor);
  }, [getNewColors, getNewPivots, plaidSettings]);


  // We need to check if plaidSettings is a valid object before generating plaidImageCanvas
  const plaidImageCanvas = useMemo(() => {
    if (!plaidSettings.colors.length || !plaidSettings.pivots.length) {
      return null; // If plaidSettings is not valid, return null
    }
    const plaidArrary = generatePlaid(plaidSettings);
    return rgbArrayToPatternCanvas(plaidArrary);
  }, [plaidSettings]);

  const plaidPreview = useMemo(() => plaidImageCanvas && createSizedCanvas(plaidImageCanvas).toDataURL(), [plaidImageCanvas]);


  return (
    <>
      {showOverlay && <div
        className="full-screen-overlay"
        onClick={() => setShowOverlay(false)}
        style={{
          backgroundImage: `url(${plaidImageCanvas.toDataURL()})`,
        }} />}

      <div className="container">
        <ImageUploader
          startUploading={() => setIsLoading(true)}
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
          setNumOfColor={setNumOfColor}
          getNewColors={getNewColors}
          plaidSettings={plaidSettings}
          setPlaidSettings={setPlaidSettings}
        />
        <GenerateButtons
          getNewPivots={getNewPivots}
          getNewColors={getNewColors}
          setPivotsAndColors={(pivotsAndColors) =>
            setPlaidSettings({ ...plaidSettings, ...pivotsAndColors })
          }
        />
        {isLoading ? (
          <div className="spinner" />
        ) : (
          <div>
            {showOverlay && <img
              src={image}
              alt="preview"
              className="preview full-screen-overlay-image"
              onClick={() => setShowOverlay(false)}
            />}

            {!!image && <img
              src={image}
              alt="preview"
              className="preview"
            />}
          </div>
        )}

        {!!plaidPreview && <img
          src={plaidPreview}
          alt="preview"
          className="preview"
          onClick={() => setShowOverlay(true)}
        />}
      </div>

    </>
  );
};

export default Plaidr;

