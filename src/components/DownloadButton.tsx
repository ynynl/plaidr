import React from "react";

interface DownloadButtonProps {
  imageUrl: string | undefined | null;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ imageUrl }) => {
  const handleDownload = () => {
    if (!imageUrl) return;

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `plaid-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="btn btn--download"
      disabled={!imageUrl}
    >
      <svg
        className="download-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      Download
    </button>
  );
};

export default DownloadButton;
