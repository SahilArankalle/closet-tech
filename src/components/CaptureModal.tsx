
import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Check, Crop } from 'lucide-react';
import { ClothingItem } from '../types/wardrobe';
import ImageCropper from './ImageCropper';

interface CaptureModalProps {
  onClose: () => void;
  onAddItem: (item: Omit<ClothingItem, 'id'>) => void;
}

const CaptureModal: React.FC<CaptureModalProps> = ({ onClose, onAddItem }) => {
  const [step, setStep] = useState<'capture' | 'crop' | 'details'>('capture');
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'top' as const,
    color: '',
    material: '',
    season: 'all' as const,
    occasion: 'casual' as const
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOriginalImageUrl(url);
      setStep('crop');
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setImageUrl(croppedImageUrl);
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Omit<ClothingItem, 'id'> = {
      ...formData,
      imageUrl,
      dateAdded: new Date().toISOString()
    };
    onAddItem(newItem);
    onClose();
  };

  const skipCrop = () => {
    setImageUrl(originalImageUrl);
    setStep('details');
  };

  return (
    <>
      {step === 'crop' && originalImageUrl && (
        <ImageCropper
          imageUrl={originalImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => setStep('capture')}
        />
      )}

      {step !== 'crop' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {step === 'capture' ? 'Add New Item' : 'Item Details'}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {step === 'capture' ? 'Capture or upload your clothing item' : 'Complete the item information'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {step === 'capture' ? (
              <div className="p-6">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl p-12 mb-6 border border-slate-200/50">
                    <Camera className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Capture Your Clothing</h3>
                    <p className="text-slate-600 mb-6">Take a photo or upload an image of your clothing item</p>
                    
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-violet-800 transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg font-medium"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose Photo</span>
                    </button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
                    <p className="text-sm text-slate-600">
                      💡 For best results, use good lighting and a clean background
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {imageUrl && (
                  <div className="relative">
                    <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/50">
                      <img 
                        src={imageUrl} 
                        alt="Captured item"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {originalImageUrl && (
                      <button
                        type="button"
                        onClick={() => setStep('crop')}
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 rounded-xl px-3 py-1.5 text-sm font-medium flex items-center space-x-1 shadow-lg transition-colors"
                      >
                        <Crop className="w-3 h-3" />
                        <span>Re-crop</span>
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Item Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900 font-medium"
                      placeholder="e.g., Blue Cotton Shirt"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900 font-medium"
                      >
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="shoes">Shoes</option>
                        <option value="accessory">Accessory</option>
                        <option value="outerwear">Outerwear</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Color</label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900 font-medium"
                        placeholder="e.g., Blue"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Season</label>
                      <select
                        value={formData.season}
                        onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value as any }))}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900 font-medium"
                      >
                        <option value="all">All Season</option>
                        <option value="spring">Spring</option>
                        <option value="summer">Summer</option>
                        <option value="fall">Fall</option>
                        <option value="winter">Winter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Occasion</label>
                      <select
                        value={formData.occasion}
                        onChange={(e) => setFormData(prev => ({ ...prev, occasion: e.target.value as any }))}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900 font-medium"
                      >
                        <option value="casual">Casual</option>
                        <option value="formal">Formal</option>
                        <option value="business">Business</option>
                        <option value="sport">Sport</option>
                        <option value="party">Party</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Material (Optional)</label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900 font-medium"
                      placeholder="e.g., Cotton, Denim, Silk"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('capture')}
                    className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-4 py-2.5 rounded-xl hover:from-indigo-700 hover:to-violet-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg font-medium"
                  >
                    <Check className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CaptureModal;
