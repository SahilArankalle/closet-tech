
import React from 'react';
import { ClothingItem } from '../types/wardrobe';
import ClothingCard from './ClothingCard';

interface WardrobeGridProps {
  items: ClothingItem[];
  onDeleteItem?: (id: string) => void;
}

const WardrobeGrid: React.FC<WardrobeGridProps> = ({ items, onDeleteItem }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-8 shadow-lg">
          <div className="text-5xl">👗</div>
        </div>
        <h3 className="text-2xl font-semibold text-slate-800 mb-3">Your closet awaits</h3>
        <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
          Start building your intelligent wardrobe by adding your first clothing item
        </p>
        <div className="text-sm text-slate-500 bg-white/70 backdrop-blur-sm rounded-xl p-4 max-w-sm mx-auto border border-slate-200/50">
          💡 Tip: Use the "Add Item" button to capture photos of your clothes
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {items.map((item) => (
        <ClothingCard 
          key={item.id} 
          item={item} 
          onDelete={onDeleteItem}
        />
      ))}
    </div>
  );
};

export default WardrobeGrid;
