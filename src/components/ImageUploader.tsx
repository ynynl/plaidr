import React from "react";
import { useDropzone } from "react-dropzone";
import "./styles.css";
import sample_1 from "../images/sample-1.jpeg";
import sample_2 from "../images/sample-2.jpeg";
import sample_3 from "../images/sample-3.jpeg";

interface ImageUploaderProps {
  setImage: (image: string) => void;
  handleNewRgbArray: (rgbArray: number[][]) => void;
  startUploading: () => void;
  showPreview: () => void;
}

const ImageUploader = ({
  setImage,
  handleNewRgbArray,
  startUploading,
  showPreview,
}: ImageUploaderProps) => {
  const onDrop = (acceptedFiles: File[]) => {
    // Handle dropped files here
    startUploading();
    const uploadedImage = acceptedFiles[0];
    if (!uploadedImage.type.includes("image")) {
      alert("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(uploadedImage);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleImage(reader.result);
      }
    };
  };

  const handleImage = (imageSrc: string) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      // For image preview
      setImage(imageSrc);
      // For generating plaid
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext("2d");
      if (!context) {
        console.error("Could not get canvas context");
        return;
      }
      context.drawImage(img, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixelArray = imageData.data;
      const newRgbArray = [];
      for (let i = 0; i < pixelArray.length; i += 4) {
        const r = pixelArray[i];
        const g = pixelArray[i + 1];
        const b = pixelArray[i + 2];
        newRgbArray.push([r, g, b]);
      }
      handleNewRgbArray(newRgbArray);
      showPreview();
    };
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="drag-drop-container shadow-box">
      <input {...getInputProps()} type="file" accept="image/*" />
      <p>
        <strong>Drag 'n' drop</strong> image files here, or{" "}
        <strong>click</strong> to select a photo,
      </p>
      <p>
        or <strong>try one of the following</strong>
      </p>
      <div
        {...getRootProps({
          onClick: (event) => event.stopPropagation(),
        })}
        style={{ display: "flex", gap: "12px" }}
      >
        <ExampleImage src={sample_1} handleImage={handleImage} />
        <ExampleImage src={sample_2} handleImage={handleImage} />
        <ExampleImage src={sample_3} handleImage={handleImage} />
      </div>
    </div>
  );
};

export default ImageUploader;

interface ExampleImageProps {
  src: string;
  handleImage: (imageSrc: string) => void;
}

const ExampleImage = ({ src, handleImage }: ExampleImageProps) => {
  return (
    <img
      src={src}
      alt="Example"
      onClick={() => handleImage(src)}
      style={{ borderRadius: "50%", width: "36px", height: "36px" }}
    />
  );
};
