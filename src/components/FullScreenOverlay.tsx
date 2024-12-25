import React, { useEffect } from "react";

interface FullScreenOverlayProps {
  showOverlay: boolean;
  setShowOverlay: (show: boolean) => void;
  imageUrl: string | null;
  plaidImageCanvas: HTMLCanvasElement | null;
}

const FullScreenOverlay: React.FC<FullScreenOverlayProps> = ({
  showOverlay,
  setShowOverlay,
  imageUrl,
  plaidImageCanvas,
}) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showOverlay) {
        setShowOverlay(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [showOverlay, setShowOverlay]);

  if (!showOverlay || !plaidImageCanvas) return null;

  return (
    <div
      className="full_screen_overlay"
      onClick={() => setShowOverlay(false)}
      style={{
        backgroundImage: `url(${plaidImageCanvas.toDataURL()})`,
      }}
    >
      <img
        src={imageUrl || undefined}
        alt="Full screen preview"
        className="full-screen-overlay__image"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default FullScreenOverlay;
