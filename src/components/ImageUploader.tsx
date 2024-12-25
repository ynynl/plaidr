import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { processImage } from "../utils/utils";

interface ImageUploaderProps {
  startUploading: () => void;
  setImage: (img: string) => void;
  handleNewRgbArray: (rgbArray: number[][]) => void;
  showPreview: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  startUploading,
  setImage,
  handleNewRgbArray,
  showPreview,
}) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      startUploading();
      const file = acceptedFiles[0];
      
      if (file.type.startsWith('image/') || file.type === 'image/heic') {
        try {
          const imageUrl = URL.createObjectURL(file);
          setImage(imageUrl);
          const rgbArray = await processImage(file);
          handleNewRgbArray(rgbArray);
          showPreview();
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    },
    [startUploading, setImage, handleNewRgbArray, showPreview]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.heic']
    },
    multiple: false,
  });

  return (
    <div {...getRootProps()} className="drag-drop-container">
      <input {...getInputProps()} />
      <p>Drag & drop an image here, or click to select</p>
      <p className="text-sm text-gray-500">
        Supports JPG, PNG, and Live Photos
      </p>
    </div>
  );
};

export default ImageUploader;
