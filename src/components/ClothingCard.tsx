
import React from 'react';
import { ClothingItem } from '../types/wardrobe';

interface ClothingCardProps {
  item: ClothingItem;
}

const ClothingCard: React.FC<ClothingCardProps> = ({ item }) => {
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
      case 'formal': return 'bg-blue-100 text-blue-700';
      case 'business': return 'bg-gray-100 text-gray-700';
      case 'casual': return 'bg-green-100 text-green-700';
      case 'sport': return 'bg-orange-100 text-orange-700';
      case 'party': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl opacity-40">
            {getCategoryIcon(item.category)}
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1">
          <div className="text-xs">{getCategoryIcon(item.category)}</div>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-gray-900 truncate mb-1">{item.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 capitalize">{item.color}</span>
          <span className={`text-xs px-2 py-1 rounded-full capitalize ${getOccasionColor(item.occasion)}`}>
            {item.occasion}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="capitalize">{item.season}</span>
          <span className="capitalize">{item.category}</span>
        </div>
      </div>
    </div>
  );
};

export default ClothingCard;
