
import React, { useState } from 'react';
import { X, Check, Plus } from 'lucide-react';
import { ClothingItem } from '../types/wardrobe';

interface OutfitSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clothingItems: ClothingItem[];
  onSaveOutfit: (selectedItems: ClothingItem[]) => void;
  title: string;
  existingItems?: ClothingItem[];
}

const OutfitSelectionModal: React.FC<OutfitSelectionModalProps> = ({
  isOpen,
  onClose,
  clothingItems,
  onSaveOutfit,
  title,
  existingItems = []
}) => {
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>(existingItems);

  if (!isOpen) return null;

  const toggleItemSelection = (item: ClothingItem) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSave = () => {
    onSaveOutfit(selectedItems);
    onClose();
  };

  const categorizedItems = {
    top: clothingItems.filter(item => item.category === 'top'),
    bottom: clothingItems.filter(item => item.category === 'bottom'),
    shoes: clothingItems.filter(item => item.category === 'shoes'),
    accessory: clothingItems.filter(item => item.category === 'accessory'),
    outerwear: clothingItems.filter(item => item.category === 'outerwear'),
  };

  const CategorySection = ({ title, items, category }: { title: string; items: ClothingItem[]; category: string }) => (
    <div className="mb-6">
      <h4 className="font-semibold text-slate-900 mb-3 text-sm">{title}</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {items.map((item) => {
          const isSelected = selectedItems.some(selected => selected.id === item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItemSelection(item)}
              className={`aspect-square rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden relative ${
                isSelected 
                  ? 'border-indigo-500 ring-2 ring-indigo-200 scale-95' 
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-2xl opacity-40">👕</div>
                )}
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-1">
                  <Check className="w-3 h-3" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
                {item.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {clothingItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">No Items Available</h4>
              <p className="text-slate-600">Add some clothing items to your wardrobe first to create outfits.</p>
            </div>
          ) : (
            <>
              <CategorySection title="Tops" items={categorizedItems.top} category="top" />
              <CategorySection title="Bottoms" items={categorizedItems.bottom} category="bottom" />
              <CategorySection title="Shoes" items={categorizedItems.shoes} category="shoes" />
              <CategorySection title="Outerwear" items={categorizedItems.outerwear} category="outerwear" />
              <CategorySection title="Accessories" items={categorizedItems.accessory} category="accessory" />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
              >
                Save Outfit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitSelectionModal;
