
import React from 'react';
import { ClothingItem } from '../types/wardrobe';
import ClothingCard from './ClothingCard';

interface WardrobeGridProps {
  items: ClothingItem[];
}

const WardrobeGrid: React.FC<WardrobeGridProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <div className="text-4xl">👕</div>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Your wardrobe is empty</h3>
        <p className="text-gray-500 mb-6">Start building your digital wardrobe by adding your first clothing item</p>
        <div className="text-sm text-gray-400">
          Tip: Use the "Add Item" button to capture photos of your clothes
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <ClothingCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default WardrobeGrid;
