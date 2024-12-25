import React, { useState, useMemo, useCallback } from "react";
import {
  getRandomItems,
  getRandomPivots,
  generatePlaidImageCanvas,
  canvasToImgSrc,
  generateThumbNailImgSrc,
} from "../utils/utils";
import { ColorPicker, TwillPicker, SizePicker } from "./Picker";
import GenerateButtons from "./GenerateButtons";
import ImageUploader from "./ImageUploader";
import PreviewSizeInput from "./PreviewSizeInput";
import LikedPlaids from "./LikedPlaids";
import "./styles.css";

import { PlaidSettings, LikedPlaid } from "../types";

interface ImagePreviewTabProps {
  image: string | undefined;
  isLoading: boolean;
  setShowOverlay: (show: boolean) => void;
  showOverlay: boolean;
}

const ImagePreviewTab = ({
  image,
  isLoading,
  setShowOverlay,
  showOverlay,
}: ImagePreviewTabProps) => {
  return (
    <div className="tab-container">
      {isLoading ? (
        <div className="spinner" />
      ) : (
        <div className="shadow-box">
          {showOverlay && image && (
            <img
              src={image}
              alt="upload preview"
              className="preview--md full-screen-overlay__image preview preview-square"
              onClick={() => setShowOverlay(false)}
            />
          )}

          {!!image && (
            <img src={image} alt="preview" className="preview--md preview" />
          )}
        </div>
      )}
    </div>
  );
};

interface LikeButtonProps {
  liked: boolean;
  handleLike: () => void;
}

const LikeButton = ({ liked, handleLike }: LikeButtonProps) => (
  <div className="preview-like__btn">
    {liked ? (
      <span>💜</span>
    ) : (
      <button onClick={handleLike} className="btn btn--primary">
        💜
      </button>
    )}
  </div>
);

const Plaidr = () => {
  const [image, setImage] = useState<string>();
  const [imageArray, setImageArray] = useState<number[][]>([]);
  const [plaidSettings, setPlaidSettings] = useState<PlaidSettings>({
    colors: [],
    size: 128,
    twill: "tartan" as const,
    pivots: [],
  });
  const [numOfColor, setNumOfColor] = useState(5);
  const [showOverlay, setShowOverlay] = useState(false); // new state variable
  const [isLoading, setIsLoading] = useState(false);
  const [plaidWidth, setPlaidWidth] = useState(300);
  const [plaidHeight, setPlaidHeight] = useState(300);
  const [likedPlaids, setLikedPlaids] = useState<LikedPlaid[]>([]);
  const [nextId, setNextId] = useState(1);
  const [liked, setLiked] = useState(false);
  const [showUploader, setShowUploader] = useState(true);

  const onChangePlaidSettings = (
    plaidSettings: React.SetStateAction<PlaidSettings>
  ) => {
    setPlaidSettings(plaidSettings);
    setLiked(false);
  };

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
    (newRgbArray: number[][]) => {
      setImageArray(newRgbArray);
      onChangePlaidSettings((plaidSettings) => ({
        ...plaidSettings,
        colors: getNewColors(numOfColor, newRgbArray),
        pivots: getNewPivots(),
      }));
      setIsLoading(false);
    },
    [getNewColors, getNewPivots, numOfColor]
  );

  // We need to check if plaidSettings is a valid object before generating plaidImageCanvas
  const plaidImageCanvas = useMemo(
    () => generatePlaidImageCanvas(plaidSettings),
    [plaidSettings]
  );

  const plaidPreview = useMemo(
    () =>
      plaidImageCanvas &&
      canvasToImgSrc(plaidImageCanvas, plaidWidth, plaidHeight),
    [plaidImageCanvas, plaidWidth, plaidHeight]
  );

  const handleLike = useCallback(() => {
    setLikedPlaids((likedPlaids) => [
      {
        ...plaidSettings,
        id: nextId,
        src: generateThumbNailImgSrc(plaidSettings),
      },
      ...likedPlaids,
    ]);

    const storedLikedPlaidsInString = localStorage.getItem("likedPlaids");
    const storedLikedPlaids = storedLikedPlaidsInString
      ? JSON.parse(storedLikedPlaidsInString)
      : [];
    localStorage.setItem(
      "likedPlaids",
      JSON.stringify([
        {
          ...plaidSettings,
          id: nextId,
        },
        ...storedLikedPlaids,
      ])
    );
    localStorage.setItem("nextId", (nextId + 1).toString());

    setNextId(nextId + 1);

    setLiked(true);
  }, [plaidSettings, nextId]);

  const handleSelectLiked = (selectedPlaid: LikedPlaid) => {
    setPlaidSettings(selectedPlaid);
    setNumOfColor(selectedPlaid.colors.length);
    setLiked(true);
  };

  const FullScreenOverLay = () => {
    if (!plaidImageCanvas || !showOverlay) return null;
    return (
      <div
        className="full_screen_overlay"
        onClick={() => setShowOverlay(false)}
        style={{
          backgroundImage: `url(${plaidImageCanvas.toDataURL()})`,
        }}
      />
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <FullScreenOverLay />
      <div className="flex flex-col gap-8">
        {/* Update grid to use full width and equal columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          {/* Left column wrapper - add full width */}
          <div className="w-full">
            {/* Upload/Preview Section */}
            <div className="content-section mb-8">
              {showUploader ? (
                <ImageUploader
                  startUploading={() => setIsLoading(true)}
                  setImage={(img) => {
                    setImage(img);
                    setShowUploader(false);
                  }}
                  handleNewRgbArray={handleNewRgbArray}
                  showPreview={() => setShowUploader(false)}
                />
              ) : (
                <div className="preview-section">
                  <button 
                    onClick={() => setShowUploader(true)}
                    className="back-button mb-4"
                  >
                    ← Back to Upload
                  </button>
                  
                  <ImagePreviewTab
                    image={image}
                    isLoading={isLoading}
                    setShowOverlay={setShowOverlay}
                    showOverlay={showOverlay}
                  />
                </div>
              )}
            </div>

            {/* Settings Section */}
            {!showUploader && plaidSettings.colors.length > 0 && (
              <div className="content-section">
                <h2 className="text-lg font-semibold mb-4">Plaid Settings</h2>
                <div className="plaid-setting">
                  <TwillPicker
                    twill={plaidSettings.twill}
                    setTwill={(twill) =>
                      onChangePlaidSettings((plaidSettings) => ({
                        ...plaidSettings,
                        twill,
                      }))
                    }
                  />
                  <SizePicker
                    size={plaidSettings.size}
                    setSize={(size) =>
                      onChangePlaidSettings((plaidSettings) => ({
                        ...plaidSettings,
                        size,
                      }))
                    }
                  />
                  <ColorPicker
                    numOfColor={numOfColor}
                    setNumOfColor={setNumOfColor}
                    getNewColors={getNewColors}
                    setPlaidSettings={onChangePlaidSettings}
                    disabled={!imageArray.length}
                  />
                  <PreviewSizeInput
                    plaidWidth={plaidWidth}
                    plaidHeight={plaidHeight}
                    setPlaidWidth={setPlaidWidth}
                    setPlaidHeight={setPlaidHeight}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right column wrapper - add full width and adjust sticky behavior */}
          <div className="w-full">
            {!showUploader && plaidSettings.colors.length > 0 && (
              <div className="content-section h-fit lg:sticky lg:top-8">
                <h2 className="text-lg font-semibold mb-4">Preview</h2>
                <div className="plaid-preview-container">
                  <img
                    src={plaidPreview || undefined}
                    alt="preview"
                    className="plaid-preview-image"
                    onClick={() => setShowOverlay(true)}
                  />
                  <LikeButton liked={liked} handleLike={handleLike} />
                </div>
                <div className="mt-4">
                  <GenerateButtons
                    getNewPivots={getNewPivots}
                    getNewColors={getNewColors}
                    setPivotsAndColors={(pivotsAndColors) =>
                      onChangePlaidSettings({ ...plaidSettings, ...pivotsAndColors })
                    }
                    hasColors={!!imageArray.length}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom section - Liked plaids */}
        <div className="content-section">
          <LikedPlaids
            handleSelectPlaid={handleSelectLiked}
            likedPlaids={likedPlaids}
            setLikedPlaids={setLikedPlaids}
            setNextId={setNextId}
          />
        </div>
      </div>
    </div>
  );
};

export default Plaidr;
