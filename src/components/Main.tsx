import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  getRandomItems,
  getRandomPivots,
  generatePlaidImageCanvas,
  canvasToImgSrc,
  generateThumbNailImgSrc,
  processImage,
} from "../utils/utils";
import { ColorPicker, TwillPicker, SizePicker } from "./Picker";
import GenerateButtons from "./GenerateButtons";
import ImageUploader from "./ImageUploader";
import PreviewSizeInput from "./PreviewSizeInput";
import LikedPlaids from "./LikedPlaids";
import "./styles.css";
import Accordion from "./Accordion";
import DownloadButton from "./DownloadButton";
import Hero from "./Hero";
import FullScreenOverlay from "./FullScreenOverlay";

import { PlaidSettings, LikedPlaid } from "../types";
import sample1 from "../images/sample-1.jpeg";
import sample2 from "../images/sample-2.jpeg";
import sample3 from "../images/sample-3.jpeg";

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
      <span className="like-status">Liked</span>
    ) : (
      <button onClick={handleLike} className="like-button">
        Like
      </button>
    )}
  </div>
);

const Main = () => {
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
  const previewRef = useRef<HTMLDivElement>(null);

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

  const scrollToPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewRgbArray = useCallback(
    (newRgbArray: number[][]) => {
      setImageArray(newRgbArray);
      onChangePlaidSettings((plaidSettings) => ({
        ...plaidSettings,
        colors: getNewColors(numOfColor, newRgbArray),
        pivots: getNewPivots(),
      }));
      setIsLoading(false);
      setTimeout(scrollToPreview, 100);
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

  const startUploading = () => setIsLoading(true);
  const showPreview = () => setShowUploader(false);

  const handleExampleImage = async (src: string) => {
    startUploading();
    const response = await fetch(src);
    const blob = await response.blob();
    const file = new File([blob], "example.jpg", { type: "image/jpeg" });
    
    try {
      setImage(src);
      const rgbArray = await processImage(file);
      handleNewRgbArray(rgbArray);
      showPreview();
    } catch (error) {
      console.error('Error processing example image:', error);
    }
  };

  return (
    <div className="container relative">
      <div 
        className="fixed inset-0 w-screen z-0"
        style={
          plaidImageCanvas
            ? {
                backgroundImage: `url(${plaidImageCanvas.toDataURL()})`,
                backgroundSize: "300px",
                backgroundRepeat: "repeat",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
                opacity: 0.2,
              }
            : undefined
        }
      />
      <div className="relative z-10">
        <Hero plaidCanvas={plaidImageCanvas} />
        <FullScreenOverlay
          showOverlay={showOverlay}
          setShowOverlay={setShowOverlay}
          imageUrl={plaidPreview}
          plaidImageCanvas={plaidImageCanvas}
        />
        <div className="main-content">
          <div className="flex flex-col gap-8">
            {/* Update grid to use full width and equal columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
              {/* Left column wrapper */}
              <div className="w-full flex flex-col gap-8">
                {/* Upload/Preview Section */}
                <div className="content-section">
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
                        onClick={() => {
                          setShowUploader(true);
                          setPlaidSettings({
                            colors: [],
                            size: 128,
                            twill: "tartan",
                            pivots: [],
                          });
                          setImageArray([]);
                        }}
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
                <div className="content-section">
                  <Accordion title="Plaid Settings" defaultExpanded={false}>
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
                  </Accordion>
                </div>
              </div>

              {/* Right column wrapper - now only has preview and liked plaids */}
              <div className="w-full flex flex-col gap-8">
                  <>
                    <div className="content-section" ref={previewRef}>
                      <h2 className="text-lg font-semibold mb-4">Preview</h2>
                      <div className="preview-container">
                        {plaidSettings.colors.length > 0 ? (
                          <>
                            <div className="preview-generate-btns">
                              <GenerateButtons
                                getNewPivots={getNewPivots}
                                getNewColors={getNewColors}
                                setPivotsAndColors={(pivotsAndColors) =>
                                  onChangePlaidSettings({
                                    ...plaidSettings,
                                    ...pivotsAndColors,
                                  })
                                }
                                hasColors={!!imageArray.length}
                              />
                            </div>
                            <div className="plaid-preview-container">
                              <img
                                src={plaidPreview || undefined}
                                alt="preview"
                                className="plaid-preview-image"
                                onClick={() => setShowOverlay(true)}
                              />
                              <LikeButton liked={liked} handleLike={handleLike} />
                            </div>
                            <p className="preview-hint">
                              Click preview to view in full screen
                            </p>
                            <div className="preview-actions">
                              {plaidPreview && <DownloadButton imageUrl={plaidPreview} />}
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8 px-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                              Try with these examples:
                            </h3>
                            <div className="flex justify-center gap-4 mb-8">
                              <img
                                src={sample1}
                                alt="Example 1"
                                className="w-20 h-20 rounded-lg cursor-pointer hover:opacity-80 border border-gray-200"
                                onClick={() => handleExampleImage(sample1)}
                              />
                              <img
                                src={sample2}
                                alt="Example 2"
                                className="w-20 h-20 rounded-lg cursor-pointer hover:opacity-80 border border-gray-200"
                                onClick={() => handleExampleImage(sample2)}
                              />
                              <img
                                src={sample3}
                                alt="Example 3"
                                className="w-20 h-20 rounded-lg cursor-pointer hover:opacity-80 border border-gray-200"
                                onClick={() => handleExampleImage(sample3)}
                              />
                            </div>
                            <p className="text-gray-500">
                              Or upload your own image to create unique plaid patterns
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="content-section">
                      <h2 className="text-lg font-semibold mb-4">Liked Plaids</h2>
                      <LikedPlaids
                        handleSelectPlaid={handleSelectLiked}
                        likedPlaids={likedPlaids}
                        setLikedPlaids={setLikedPlaids}
                        setNextId={setNextId}
                      />
                    </div>
                  </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
