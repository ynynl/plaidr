import React, { useState, useMemo, useCallback } from "react";
import generatePlaid from "../utils/plaid";
import {
  rgbArrayToPatternCanvas,
  createSizedCanvas,


  canvasToImgSrc,
  getRandomItems,
  getRandomPivots,
  generatePlaidImageCanvas,
  generateThumbNailImgSrc
} from "../utils/utils";
import { ColorPicker, TwillPicker, SizePicker } from "./Picker";
import GenerateButtons from "./GenerateButtons";
import ImageUploader from "./ImageUploader";
import PreviewSizeInput from "./PreviewSizeInput";
import LikedPlaids from "./LikedPlaids";
import "./styles.css";

import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const ImagePreviewTab = ({ image, isLoading, setShowOverlay, showOverlay }) => {
  return (
    <div className="inner-container">
      {isLoading ? (
        <div className="spinner" />
      ) : (
        <div>
          {showOverlay && (
            <img
              src={image}
              alt="image preview"
              className="image-container full-screen-overlay-image preview preview-square"
              onClick={() => setShowOverlay(false)}
            />
          )}

          {!!image && <img src={image} alt="preview" className="image-container preview" />}
        </div>
      )}
    </div>
  );
};

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
  const [tabIndex, setTabIndex] = useState(0);
  const [plaidWidth, setPlaidWidth] = useState(300);
  const [plaidHeight, setPlaidHeight] = useState(300);
  const [likedPlaids, setLikedPlaids] = useState([]);

  const getNewPivots = useCallback(
    (currNumOfColor = numOfColor) => getRandomPivots(currNumOfColor - 1),
    [numOfColor]
  );

  const getNewColors = useCallback(
    (currNumOfColor = numOfColor, currRgbArray = imageArray) =>
      getRandomItems(currRgbArray, currNumOfColor),
    [imageArray, numOfColor]
  );

  const handleNewRgbArray = useCallback(
    (newRgbArray) => {
      setImageArray(newRgbArray);
      setPlaidSettings((plaidSettings) => ({
        ...plaidSettings,
        colors: getNewColors(numOfColor, newRgbArray),
        pivots: getNewPivots(),
      }));
      setIsLoading(false);
    },
    [getNewColors, getNewPivots, numOfColor]
  );

  // // We need to check if plaidSettings is a valid object before generating plaidImageCanvas
  // const plaidImageCanvas = useMemo(() => generatePlaidImageCanvas(plaidSettings), [plaidSettings]);

  // const plaidPreview = useMemo(() => generateImgSrc(plaidSettings)
  // [plaidImageCanvas, plaidWidth, plaidHeight]);

  const plaidImageCanvas = useMemo(() => {
    if (!plaidSettings.colors.length || !plaidSettings.pivots.length) {
      return null; // If plaidSettings is not valid, return null
    }
    const plaidArray = generatePlaid(plaidSettings);
    return rgbArrayToPatternCanvas(plaidArray);
  }, [plaidSettings]);

  const plaidPreview = useMemo(
    () => plaidImageCanvas && createSizedCanvas(plaidImageCanvas).toDataURL(),
    [plaidImageCanvas]
  );

  const handleLike = useCallback(() => {
    setLikedPlaids([...likedPlaids, {
      ...plaidSettings,
      src: generateThumbNailImgSrc(plaidSettings)
    }]);
    localStorage.setItem("likedPlaids", JSON.stringify([...likedPlaids, plaidSettings]));
  }, [likedPlaids, plaidSettings]);


  return (
    <div className="container">
      {showOverlay && (
        <div
          className="full-screen-overlay"
          onClick={() => setShowOverlay(false)}
          style={{
            backgroundImage: `url(${plaidImageCanvas.toDataURL()})`,
          }}
        ></div>
      )}

      <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
        <TabList>
          <Tab>Upload Image</Tab>
          <Tab disabled={!image}>Image Preview</Tab>
          <Tab disabled={!plaidSettings.colors.length}>Plaid Settings</Tab>
        </TabList>

        <TabPanel>
          <div className="inner-container">
            <ImageUploader
              startUploading={() => setIsLoading(true)}
              setImage={setImage}
              handleNewRgbArray={handleNewRgbArray}
              showPreview={() => setTabIndex(1)}
            />
          </div>
        </TabPanel>

        <TabPanel>
          <ImagePreviewTab
            image={image}
            isLoading={isLoading}
            setShowOverlay={setShowOverlay}
            showOverlay={showOverlay}
          />
        </TabPanel>

        <TabPanel>
          <div className="inner-container">
            <div>
              <TwillPicker
                twill={plaidSettings.twill}
                setTwill={(twill) =>
                  setPlaidSettings((plaidSettings) => ({ ...plaidSettings, twill }))
                }
              />
              <SizePicker
                size={plaidSettings.size}
                setSize={(size) =>
                  setPlaidSettings((plaidSettings) => ({ ...plaidSettings, size }))
                }
              />
              <ColorPicker
                numOfColor={numOfColor}
                setNumOfColor={setNumOfColor}
                getNewColors={getNewColors}
                setPlaidSettings={setPlaidSettings}
              />
              <PreviewSizeInput
                plaidWidth={plaidWidth}
                plaidHeight={plaidHeight}
                setPlaidWidth={setPlaidWidth}
                setPlaidHeight={setPlaidHeight}
              />
            </div>
          </div>
        </TabPanel>
      </Tabs>


      {!!plaidPreview && (
        <div className="inner-container">
          <img
            src={plaidPreview}
            alt="preview"
            className="preview-plaid"
            onClick={() => setShowOverlay(true)}
            width="100%"
          />
          <GenerateButtons
            getNewPivots={getNewPivots}
            getNewColors={getNewColors}
            setPivotsAndColors={(pivotsAndColors) =>
              setPlaidSettings({ ...plaidSettings, ...pivotsAndColors })
            }
            onLike={handleLike}
          />
        </div>
      )}

      <LikedPlaids likedPlaids={likedPlaids} setLikedPlaids={setLikedPlaids} />
    </div>
  );
};

export default Plaidr;
