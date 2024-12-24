import React from "react";

interface DownloadButtonProps {
  canvas: HTMLCanvasElement;
  filename: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ canvas, filename }) => {
  const downloadCanvasAsImage = () => {
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;

    document.body.appendChild(link);
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