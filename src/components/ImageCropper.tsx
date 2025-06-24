
import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Check, RotateCcw } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const getCroppedImg = async () => {
    const image = imgRef.current;
    const currentCrop = completedCrop || crop;
    
    if (!image || !currentCrop) {
      console.log('Missing image or crop data');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('Failed to get canvas context');
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Convert percentage crop to pixel crop if needed
    const pixelCrop = {
      x: currentCrop.unit === '%' ? (currentCrop.x / 100) * image.naturalWidth : currentCrop.x * scaleX,
      y: currentCrop.unit === '%' ? (currentCrop.y / 100) * image.naturalHeight : currentCrop.y * scaleY,
      width: currentCrop.unit === '%' ? (currentCrop.width / 100) * image.naturalWidth : currentCrop.width * scaleX,
      height: currentCrop.unit === '%' ? (currentCrop.height / 100) * image.naturalHeight : currentCrop.height * scaleY,
    };

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise<void>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedImageUrl = URL.createObjectURL(blob);
          console.log('Crop successful, calling onCropComplete');
          onCropComplete(croppedImageUrl);
        } else {
          console.log('Failed to create blob from canvas');
        }
        resolve();
      }, 'image/jpeg', 0.9);
    });
  };

  const handleReset = () => {
    const newCrop = { unit: '%' as const, width: 80, height: 80, x: 10, y: 10 };
    setCrop(newCrop);
    setCompletedCrop(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="max-h-[300px] overflow-auto">
        <ReactCrop
          crop={crop}
          onChange={setCrop}
          onComplete={setCompletedCrop}
          aspect={1}
          className="max-w-full"
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Crop preview"
            className="max-w-full h-auto rounded-xl"
            onLoad={() => console.log('Image loaded successfully')}
          />
        </ReactCrop>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center space-x-2 font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={getCroppedImg}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-700 text-white rounded-xl hover:from-indigo-700 hover:to-violet-800 transition-all duration-200 flex items-center space-x-2 font-medium shadow-lg"
          >
            <Check className="w-4 h-4" />
            <span>Apply Crop</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
