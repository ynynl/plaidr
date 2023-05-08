import React from "react";

const ImageUploader = ({ setImage, handleNewRgbArray, startUploading }) => {
  const handleImageUpload = (event) => {
    startUploading()
    const uploadedImage = event.target.files[0];
    if (!uploadedImage.type.includes("image")) {
      alert("Please upload an image file.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(uploadedImage);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        // For image preview
        setImage(reader.result);
        // For generating plaid
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
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
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
};

export default ImageUploader;
