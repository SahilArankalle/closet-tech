
import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Loader2 } from 'lucide-react';
import { useClothes } from '../hooks/useClothes';
import ImageCropper from './ImageCropper';

interface CaptureModalProps {
  onClose: () => void;
}

const CaptureModal: React.FC<CaptureModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<'capture' | 'crop' | 'details'>('capture');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [croppedImage, setCroppedImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'top' as const,
    color: '',
    occasion: 'casual' as const
  });

  const { addClothingItem, uploadImage, refetch } = useClothes();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('CaptureModal: Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageUrl);
    setStep('crop');
    stopCamera();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setCapturedImage(imageUrl);
      setStep('crop');
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setCroppedImage(croppedImageUrl);
    setStep('details');
  };

  const handleSave = async () => {
    if (!croppedImage || !formData.color.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      console.log('CaptureModal: Starting save process...');
      
      // Convert cropped image to blob
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], `clothing-${Date.now()}.jpg`, { type: 'image/jpeg' });

      console.log('CaptureModal: Uploading image...');
      // Upload to Supabase storage - this now returns the file path
      const filePath = await uploadImage(file);
      if (!filePath) {
        throw new Error('Failed to upload image');
      }

      console.log('CaptureModal: Image uploaded successfully with path:', filePath);

      // Save clothing item to database with the file path
      const newItem = await addClothingItem({
        name: formData.name || 'Untitled Item',
        category: formData.category,
        color: formData.color,
        occasion: formData.occasion,
        image_url: filePath // Store the file path, not the URL
      });

      console.log('CaptureModal: Item saved successfully:', newItem);
      
      // Refresh the clothes list to ensure UI updates
      await refetch();
      console.log('CaptureModal: Clothes list refreshed');
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('CaptureModal: Error saving item:', error);
      alert('Failed to save item: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (step === 'capture') {
      startCamera();
    }
    return () => stopCamera();
  }, [step]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">
            {step === 'capture' && 'Capture Item'}
            {step === 'crop' && 'Crop Image'}
            {step === 'details' && 'Item Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {step === 'capture' && (
              <div className="space-y-4">
                <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-lg hover:scale-105 transition-transform"
                  >
                    <Camera className="w-6 h-6 text-slate-700" />
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-slate-600 mb-4">Or upload from gallery</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>
            )}

            {step === 'crop' && capturedImage && (
              <ImageCropper
                imageUrl={capturedImage}
                onCropComplete={handleCropComplete}
                onCancel={() => setStep('capture')}
              />
            )}

            {step === 'details' && (
              <div className="space-y-4">
                {croppedImage && (
                  <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-4">
                    <img
                      src={croppedImage}
                      alt="Cropped item"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessory">Accessory</option>
                    <option value="outerwear">Outerwear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color *
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter color"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Occasion
                  </label>
                  <select
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="business">Business</option>
                    <option value="sport">Sport</option>
                    <option value="party">Party</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {step === 'details' && (
          <div className="p-4 border-t border-slate-200 flex-shrink-0">
            <div className="flex space-x-3">
              <button
                onClick={() => setStep('crop')}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !formData.color.trim()}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-violet-800 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Save Item'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptureModal;
