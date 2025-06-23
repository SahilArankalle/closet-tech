
import React, { useState } from 'react';
import { Crown, Heart, Briefcase, Sparkles, Plus, Calendar } from 'lucide-react';
import { ClothingItem } from '../types/wardrobe';

interface OccasionPlannerProps {
  clothingItems: ClothingItem[];
}

interface OccasionOutfit {
  id: string;
  occasion: string;
  items: ClothingItem[];
  dateCreated: string;
}

const OccasionPlanner: React.FC<OccasionPlannerProps> = ({ clothingItems }) => {
  const [outfits, setOutfits] = useState<OccasionOutfit[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');

  const occasions = [
    { id: 'wedding', name: 'Wedding', icon: Heart, color: 'from-rose-500 to-pink-600' },
    { id: 'party', name: 'Party', icon: Sparkles, color: 'from-violet-500 to-purple-600' },
    { id: 'interview', name: 'Interview', icon: Briefcase, color: 'from-indigo-500 to-blue-600' },
    { id: 'festival', name: 'Festival', icon: Crown, color: 'from-amber-500 to-orange-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 shadow-sm">
        <div className="text-center">
          <div className="bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Occasion Outfits</h2>
          <p className="text-slate-600 max-w-md mx-auto">
            Plan and save perfect outfits for special occasions and events
          </p>
        </div>
      </div>

      {/* Occasions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {occasions.map((occasion) => {
          const Icon = occasion.icon;
          const occasionOutfits = outfits.filter(outfit => outfit.occasion === occasion.id);
          
          return (
            <div key={occasion.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className={`bg-gradient-to-r ${occasion.color} p-6 text-white`}>
                <Icon className="w-8 h-8 mb-3" />
                <h3 className="text-lg font-semibold">{occasion.name}</h3>
                <p className="text-white/80 text-sm">
                  {occasionOutfits.length} {occasionOutfits.length === 1 ? 'outfit' : 'outfits'}
                </p>
              </div>
              
              <div className="p-6">
                {occasionOutfits.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {occasionOutfits.slice(0, 2).map((outfit) => (
                      <div key={outfit.id} className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-2">
                            {outfit.items.slice(0, 3).map((item, index) => (
                              <div key={item.id} className="w-8 h-8 bg-white rounded-full border-2 border-white flex items-center justify-center text-xs shadow-sm">
                                {item.imageUrl ? (
                                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                  '👕'
                                )}
                              </div>
                            ))}
                            {outfit.items.length > 3 && (
                              <div className="w-8 h-8 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center text-xs text-slate-600">
                                +{outfit.items.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-slate-900 flex-1">
                            {outfit.items.length} items
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500 mb-4">No outfits planned</p>
                  </div>
                )}
                
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl transition-colors flex items-center justify-center space-x-2 font-medium">
                  <Plus className="w-4 h-4" />
                  <span>Plan Outfit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Outfits */}
      {outfits.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Occasion Outfits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {outfits.slice(0, 6).map((outfit) => {
              const occasion = occasions.find(occ => occ.id === outfit.occasion);
              return (
                <div key={outfit.id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    {occasion && <occasion.icon className="w-5 h-5 text-slate-600" />}
                    <span className="font-medium text-slate-900 capitalize">{outfit.occasion}</span>
                  </div>
                  <div className="flex -space-x-1">
                    {outfit.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="w-10 h-10 bg-slate-100 rounded-lg border-2 border-white flex items-center justify-center text-xs shadow-sm">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          '👕'
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {clothingItems.length === 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 border border-slate-200/50 text-center shadow-sm">
          <div className="bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">Plan Your Special Occasions</h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            Add clothing items to your wardrobe first to start planning outfits for special occasions
          </p>
          <div className="bg-slate-50 rounded-xl p-4 max-w-sm mx-auto border border-slate-200/50">
            <p className="text-sm text-slate-600">
              💡 Once you have items, you'll be able to create themed outfits for weddings, parties, interviews, and festivals
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OccasionPlanner;
