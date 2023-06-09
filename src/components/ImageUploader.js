import React from "react";
import { useDropzone } from "react-dropzone";
import "./styles.css";
import sample_1 from "../images/sample-1.jpeg";
import sample_2 from "../images/sample-2.jpeg";
import sample_3 from "../images/sample-3.jpeg";

const ImageUploader = ({
  setImage,
  handleNewRgbArray,
  startUploading,
  showPreview,
}) => {
  const onDrop = (acceptedFiles) => {
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
      handleImage(reader.result);
    };
  };

  const handleImage = (imageSrc) => {
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
        <strong>Drag 'n' drop</strong> image files here, or <strong>click</strong> to select a photo,
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

const ExampleImage = ({ src, handleImage }) => {
  return (
    <img
      src={src}
      alt="Example"
      onClick={() => handleImage(src)}
      style={{ borderRadius: "50%", width: "36px", height: "36px" }}
    />
  );
};
