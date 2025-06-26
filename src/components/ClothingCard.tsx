
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ClothingItem } from '../types/wardrobe';

interface ClothingCardProps {
  item: ClothingItem;
  onDelete?: (id: string) => void;
}

const ClothingCard: React.FC<ClothingCardProps> = ({ item, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'top': return '👕';
      case 'bottom': return '👖';
      case 'shoes': return '👟';
      case 'accessory': return '👜';
      case 'outerwear': return '🧥';
      default: return '👕';
    }
  };

  const getOccasionColor = (occasion: string) => {
    switch (occasion) {
      case 'formal': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'business': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'casual': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'sport': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'party': return 'bg-violet-100 text-violet-700 border-violet-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  console.log('ClothingCard: Rendering item:', item.name, 'Image URL:', item.imageUrl);

  // Check if the URL is a valid image URL
  const isValidImageUrl = item.imageUrl && 
    item.imageUrl.trim() !== '' && 
    (item.imageUrl.startsWith('http') || item.imageUrl.startsWith('https'));

  const handleImageLoad = () => {
    console.log('ClothingCard: Image loaded successfully for:', item.name);
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('ClothingCard: Image failed to load for item:', item.name);
    console.error('ClothingCard: Image URL:', item.imageUrl);
    console.error('ClothingCard: Error event:', e);
    setImageError(true);
    setImageLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-slate-200/50">
      <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
        {isValidImageUrl && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            )}
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <div className="text-6xl opacity-40">
            {getCategoryIcon(item.category)}
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
          <div className="text-xs">{getCategoryIcon(item.category)}</div>
        </div>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="absolute top-3 left-3 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}

        {/* Debug info - remove in production */}
        {imageError && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Image Error
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 truncate mb-2 text-base">{item.name}</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-600 capitalize font-medium">{item.color}</span>
          <span className={`text-xs px-2.5 py-1 rounded-full capitalize border font-medium ${getOccasionColor(item.occasion)}`}>
            {item.occasion}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="capitalize bg-slate-100 px-2 py-1 rounded-lg">{item.season}</span>
          <span className="capitalize font-medium">{item.category}</span>
        </div>
        {item.material && (
          <div className="mt-2 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
            {item.material}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClothingCard;
