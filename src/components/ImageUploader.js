import React from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = ({ setImage, handleNewRgbArray, startUploading }) => {
  const onDrop = (acceptedFiles) => {
    // Handle dropped files here
    startUploading()
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
    };
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (

    <div
      {...getRootProps()}
      style={{
        width: "100%",
        height: "100%",
        border: "2px dashed black",
        padding: "25px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        cursor:'pointer'
      }}
    >
      <input {...getInputProps()} type="file" accept="image/*" />
      <p>Drag 'n' drop image files here, or click to select files</p>
      <div
        {...getRootProps({
          onClick: (event) => event.stopPropagation(),
        })} style={{ display: "flex", gap: "8px" }}>
        <ExampleImage
          src={"/images/sample-1.jpeg"}
          handleImage={handleImage}
        />
        <ExampleImage
          src={"/images/sample-2.jpeg"}
          handleImage={handleImage}
        />
        <ExampleImage
          src={"/images/sample-3.jpeg"}
          handleImage={handleImage}
        />
      </div>
    </div>
  );
};

export default ImageUploader;

const ExampleImage = ({ src, handleImage }) => {
  return (
    <img
      src={src}
      alt="Example Image"
      onClick={() => handleImage(src)}
      style={{ borderRadius: "50%", width: "36px", height: "36px" }}
    />
  );
};
