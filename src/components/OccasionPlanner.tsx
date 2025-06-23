
import React, { useState, useEffect } from 'react';
import { Crown, Heart, Briefcase, Sparkles, Plus, Calendar, Edit3, Trash2 } from 'lucide-react';
import { ClothingItem } from '../types/wardrobe';
import OutfitSelectionModal from './OutfitSelectionModal';

interface OccasionPlannerProps {
  clothingItems: ClothingItem[];
}

interface OccasionOutfit {
  id: string;
  occasion: string;
  items: ClothingItem[];
  dateCreated: string;
  name?: string;
}

const OccasionPlanner: React.FC<OccasionPlannerProps> = ({ clothingItems }) => {
  const [outfits, setOutfits] = useState<OccasionOutfit[]>([]);
  const [showOutfitModal, setShowOutfitModal] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [editingOutfit, setEditingOutfit] = useState<OccasionOutfit | null>(null);

  // Load from localStorage on component mount
  useEffect(() => {
    const savedOutfits = localStorage.getItem('occasionOutfits');
    if (savedOutfits) {
      setOutfits(JSON.parse(savedOutfits));
    }
  }, []);

  // Save to localStorage whenever outfits change
  useEffect(() => {
    localStorage.setItem('occasionOutfits', JSON.stringify(outfits));
  }, [outfits]);

  const occasions = [
    { id: 'wedding', name: 'Wedding', icon: Heart, color: 'from-rose-500 to-pink-600' },
    { id: 'party', name: 'Party', icon: Sparkles, color: 'from-violet-500 to-purple-600' },
    { id: 'interview', name: 'Interview', icon: Briefcase, color: 'from-indigo-500 to-blue-600' },
    { id: 'festival', name: 'Festival', icon: Crown, color: 'from-amber-500 to-orange-600' }
  ];

  const handlePlanOutfit = (occasionId: string, outfit?: OccasionOutfit) => {
    setSelectedOccasion(occasionId);
    setEditingOutfit(outfit || null);
    setShowOutfitModal(true);
  };

  const handleSaveOutfit = (selectedItems: ClothingItem[]) => {
    if (editingOutfit) {
      // Update existing outfit
      setOutfits(prev => prev.map(outfit => 
        outfit.id === editingOutfit.id 
          ? { ...outfit, items: selectedItems }
          : outfit
      ));
    } else {
      // Create new outfit
      const newOutfit: OccasionOutfit = {
        id: Date.now().toString(),
        occasion: selectedOccasion,
        items: selectedItems,
        dateCreated: new Date().toISOString(),
        name: `${occasions.find(occ => occ.id === selectedOccasion)?.name} Outfit`
      };
      setOutfits(prev => [...prev, newOutfit]);
    }
    setShowOutfitModal(false);
    setSelectedOccasion('');
    setEditingOutfit(null);
  };

  const deleteOutfit = (outfitId: string) => {
    setOutfits(prev => prev.filter(outfit => outfit.id !== outfitId));
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
        <div className="text-center">
          <div className="bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Occasion Outfits</h2>
          <p className="text-slate-600 max-w-md mx-auto text-sm md:text-base">
            Plan and save perfect outfits for special occasions and events
          </p>
        </div>
      </div>

      {/* Occasions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {occasions.map((occasion) => {
          const Icon = occasion.icon;
          const occasionOutfits = outfits.filter(outfit => outfit.occasion === occasion.id);
          
          return (
            <div key={occasion.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className={`bg-gradient-to-r ${occasion.color} p-4 md:p-6 text-white`}>
                <Icon className="w-6 h-6 md:w-8 md:h-8 mb-3" />
                <h3 className="text-base md:text-lg font-semibold">{occasion.name}</h3>
                <p className="text-white/80 text-xs md:text-sm">
                  {occasionOutfits.length} {occasionOutfits.length === 1 ? 'outfit' : 'outfits'}
                </p>
              </div>
              
              <div className="p-4 md:p-6">
                {occasionOutfits.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {occasionOutfits.slice(0, 3).map((outfit) => (
                      <div key={outfit.id} className="bg-slate-50 rounded-xl p-3 group hover:bg-slate-100 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-1">
                              {outfit.items.slice(0, 3).map((item, index) => (
                                <div key={item.id} className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-xs shadow-sm overflow-hidden">
                                  {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-full" />
                                  ) : (
                                    '👕'
                                  )}
                                </div>
                              ))}
                              {outfit.items.length > 3 && (
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center text-xs text-slate-600">
                                  +{outfit.items.length - 3}
                                </div>
                              )}
                            </div>
                            <span className="text-xs md:text-sm font-medium text-slate-900 flex-1">
                              {outfit.items.length} items
                            </span>
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handlePlanOutfit(occasion.id, outfit)}
                              className="p-1 text-indigo-600 hover:text-indigo-700 touch-manipulation"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteOutfit(outfit.id)}
                              className="p-1 text-red-500 hover:text-red-600 touch-manipulation"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {occasionOutfits.length > 3 && (
                      <div className="text-xs text-slate-500 text-center">
                        +{occasionOutfits.length - 3} more outfits
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 md:py-8">
                    <Calendar className="w-8 h-8 md:w-12 md:h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-xs md:text-sm text-slate-500 mb-4">No outfits planned</p>
                  </div>
                )}
                
                <button 
                  onClick={() => handlePlanOutfit(occasion.id)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 md:py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-2 font-medium text-sm touch-manipulation"
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Plan Outfit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Outfits */}
      {outfits.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-slate-200/50 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-4">Recent Occasion Outfits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {outfits.slice(0, 6).map((outfit) => {
              const occasion = occasions.find(occ => occ.id === outfit.occasion);
              return (
                <div key={outfit.id} className="border border-slate-200 rounded-xl p-3 md:p-4 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {occasion && <occasion.icon className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />}
                      <span className="font-medium text-slate-900 capitalize text-sm md:text-base">{outfit.occasion}</span>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handlePlanOutfit(outfit.occasion, outfit)}
                        className="p-1 text-indigo-600 hover:text-indigo-700 touch-manipulation"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteOutfit(outfit.id)}
                        className="p-1 text-red-500 hover:text-red-600 touch-manipulation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex -space-x-1">
                    {outfit.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-lg border-2 border-white flex items-center justify-center text-xs shadow-sm overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          '👕'
                        )}
                      </div>
                    ))}
                    {outfit.items.length > 4 && (
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 rounded-lg border-2 border-white flex items-center justify-center text-xs text-slate-600">
                        +{outfit.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {clothingItems.length === 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-slate-200/50 text-center shadow-sm">
          <div className="bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-6">
            <Crown className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3">Plan Your Special Occasions</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm md:text-base">
            Add clothing items to your wardrobe first to start planning outfits for special occasions
          </p>
          <div className="bg-slate-50 rounded-xl p-4 max-w-sm mx-auto border border-slate-200/50">
            <p className="text-xs md:text-sm text-slate-600">
              💡 Once you have items, you'll be able to create themed outfits for weddings, parties, interviews, and festivals
            </p>
          </div>
        </div>
      )}

      {/* Outfit Selection Modal */}
      <OutfitSelectionModal
        isOpen={showOutfitModal}
        onClose={() => {
          setShowOutfitModal(false);
          setSelectedOccasion('');
          setEditingOutfit(null);
        }}
        clothingItems={clothingItems}
        onSaveOutfit={handleSaveOutfit}
        title={`Plan ${occasions.find(occ => occ.id === selectedOccasion)?.name} Outfit`}
        existingItems={editingOutfit?.items || []}
      />
    </div>
  );
};

export default OccasionPlanner;
