
import React, { useState } from 'react';
import { Camera, Shirt, Calendar, Filter, Plus } from 'lucide-react';
import WardrobeGrid from '../components/WardrobeGrid';
import CaptureModal from '../components/CaptureModal';
import WeeklyPlanner from '../components/WeeklyPlanner';
import FilterPanel from '../components/FilterPanel';
import { ClothingItem } from '../types/wardrobe';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'planner'>('wardrobe');
  const [showCapture, setShowCapture] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    season: '',
    occasion: ''
  });

  const addClothingItem = (item: Omit<ClothingItem, 'id'>) => {
    const newItem: ClothingItem = {
      ...item,
      id: Date.now().toString()
    };
    setClothingItems(prev => [...prev, newItem]);
  };

  const filteredItems = clothingItems.filter(item => {
    return (
      (!filters.category || item.category === filters.category) &&
      (!filters.color || item.color === filters.color) &&
      (!filters.season || item.season === filters.season) &&
      (!filters.occasion || item.occasion === filters.occasion)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                <Shirt className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                WardrobeAI
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowCapture(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'wardrobe'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>My Wardrobe</span>
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'planner'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Weekly Planner</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
        {activeTab === 'wardrobe' ? (
          <div className="space-y-6">
            {showFilters && (
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
            )}
            <WardrobeGrid items={filteredItems} />
          </div>
        ) : (
          <WeeklyPlanner clothingItems={clothingItems} />
        )}
      </main>

      {/* Modals */}
      {showCapture && (
        <CaptureModal
          onClose={() => setShowCapture(false)}
          onAddItem={addClothingItem}
        />
      )}
    </div>
  );
};

export default Index;
