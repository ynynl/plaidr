import React, { useState, useMemo, useCallback } from "react";
import generatePlaid from "../utils/plaid";
import {
  rgbArrayToPatternCanvas,
  getRandomItems,
  getRandomPivots,
  createSizedCanvas,
} from "../utils/utils";
import { ColorPicker, TwillPicker, SizePicker } from "./Picker";
import GenerateButtons from "./GenerateButtons";
import ImageUploader from "./ImageUploader";
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
              alt="preview"
              className="full-screen-overlay-image preview"
              onClick={() => setShowOverlay(false)}
            />
          )}

          {!!image && <img src={image} alt="preview" className="preview" />}
        </div>
      )}
    </div>
  );
};

const PlaidSettingsTab = ({
  plaidSettings,
  numOfColor,
  setNumOfColor,
  getNewColors,
  setPlaidSettings,
}) => {
  return (
    <div className="inner-container">
      <div>
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
      </div>
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

  const getNewPivots = useCallback(
    (currNumOfColor = numOfColor) => getRandomPivots(currNumOfColor - 1),
    [numOfColor]
  );

  const getNewColors = useCallback(
    (currNumOfColor = numOfColor, cuurRgbArray = imageArray) =>
      getRandomItems(cuurRgbArray, currNumOfColor),
    [imageArray, numOfColor]
  );

  const handleNewRgbArray = useCallback(
    (newRgbArray) => {
      setImageArray(newRgbArray);
      setPlaidSettings({
        ...plaidSettings,
        colors: getNewColors(numOfColor, newRgbArray),
        pivots: getNewPivots(),
      });
      setIsLoading(false);
    },
    [getNewColors, getNewPivots, numOfColor, plaidSettings]
  );

  // We need to check if plaidSettings is a valid object before generating plaidImageCanvas
  const plaidImageCanvas = useMemo(() => {
    if (!plaidSettings.colors.length || !plaidSettings.pivots.length) {
      return null; // If plaidSettings is not valid, return null
    }
    const plaidArrary = generatePlaid(plaidSettings);
    return rgbArrayToPatternCanvas(plaidArrary);
  }, [plaidSettings]);

  const plaidPreview = useMemo(
    () => plaidImageCanvas && createSizedCanvas(plaidImageCanvas).toDataURL(),
    [plaidImageCanvas]
  );

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
          <PlaidSettingsTab
            plaidSettings={plaidSettings}
            numOfColor={numOfColor}
            setNumOfColor={setNumOfColor}
            getNewColors={getNewColors}
            setPlaidSettings={setPlaidSettings}
            getNewPivots={getNewPivots}
          />
        </TabPanel>
      </Tabs>

      {!!plaidPreview && (
        <img
          src={plaidPreview}
          alt="preview"
          className="preview"
          onClick={() => setShowOverlay(true)}
        />
      )}

      {!!plaidPreview && (
        <GenerateButtons
          getNewPivots={getNewPivots}
          getNewColors={getNewColors}
          setPivotsAndColors={(pivotsAndColors) =>
            setPlaidSettings({ ...plaidSettings, ...pivotsAndColors })
          }
        />
      )}
    </div>
  );
};

export default Plaidr;
