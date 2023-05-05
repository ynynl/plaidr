import React, { useState } from 'react';
import generate from './generater';

const ImageUpload = ({ width }) => {
  const [image, setImage] = useState(null);
  const [pngImage, setPngImage] = useState(null);

  const getRandomItems = (arr, num) => {
    const result = [];
    for (let i = 0; i < num; i++) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      result.push(arr[randomIndex]);
    }
    return result;
  };

  const arrayToDataURL = (imageArray) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageArray.length;
    canvas.height = imageArray[0].length;
    const context = canvas.getContext('2d');
    const imageData = context.createImageData(canvas.width, canvas.height);
    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        const pixelIndex = (y * canvas.width + x) * 4;
        imageData.data[pixelIndex] = imageArray[x][y][0];
        imageData.data[pixelIndex + 1] = imageArray[x][y][1];
        imageData.data[pixelIndex + 2] = imageArray[x][y][2];
        imageData.data[pixelIndex + 3] = 255;
      }
    }
    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };

  const handleImageUpload = (event) => {
    const uploadedImage = event.target.files[0];
    if (!uploadedImage.type.includes('image')) {
      alert('Please upload an image file.');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(uploadedImage);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixelArray = imageData.data;
        const rgbArray = [];
        for (let i = 0; i < pixelArray.length; i += 4) {
          const r = pixelArray[i];
          const g = pixelArray[i + 1];
          const b = pixelArray[i + 2];
          rgbArray.push([r, g, b]);
        }

        setImage(reader.result);

        const plaid = generate({
          colors: getRandomItems(rgbArray, 5),
          size: 128,
          twill: 'tartan'
        })

        const pngImage = arrayToDataURL(plaid)

        // console.log(plaid);

      //  const pngImage = canvasToImage(plaid)

        setPngImage(pngImage);

        // Convert rgbArray to png
      };
    };
  };





  return (
    <div
    // style={{ display: 'flex' }}
    >
      <div style={{ width: `${width}px`, height: `${width}px`, overflow: 'hidden' }}>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && <img src={image} alt="uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      {pngImage && <img src={pngImage} alt="converted" />}
    </div>
  );
};

export default ImageUpload;

