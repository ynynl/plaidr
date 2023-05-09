import React from "react";

const DownloadButton = ({ canvas, filename }) => {
  const downloadCanvasAsImage = () => {
    // Get data URL representing the image
    const dataUrl = canvas.toDataURL("image/png");

    // Create temporary link element
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;

    // Trigger click event on the link to download the image
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={downloadCanvasAsImage}>
      Download
    </button>
  );
};

export default DownloadButton;