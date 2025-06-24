
import React, { useState } from 'react';
import { Sparkles, Calendar, Filter, Plus, Crown, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useClothes } from '../hooks/useClothes';
import WardrobeGrid from '../components/WardrobeGrid';
import CaptureModal from '../components/CaptureModal';
import WeeklyPlanner from '../components/WeeklyPlanner';
import OccasionPlanner from '../components/OccasionPlanner';
import FilterPanel from '../components/FilterPanel';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'planner' | 'occasions'>('wardrobe');
  const [showCapture, setShowCapture] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    season: '',
    occasion: ''
  });

  const { user, signOut } = useAuth();
  const { clothes, loading, deleteClothingItem } = useClothes();

  const filteredItems = clothes.filter(item => {
    return (
      (!filters.category || item.category === filters.category) &&
      (!filters.color || item.color.toLowerCase().includes(filters.color.toLowerCase())) &&
      (!filters.occasion || item.occasion === filters.occasion)
    );
  });

  // Convert Supabase clothes to legacy format for existing components
  const legacyClothes = clothes.map(item => ({
    id: item.id,
    name: item.name || 'Untitled Item',
    category: item.category,
    color: item.color,
    season: 'all' as const,
    occasion: item.occasion,
    imageUrl: item.image_url,
    dateAdded: item.created_at,
    material: undefined
  }));

  const filteredLegacyItems = legacyClothes.filter(item => {
    return (
      (!filters.category || item.category === filters.category) &&
      (!filters.color || item.color.toLowerCase().includes(filters.color.toLowerCase())) &&
      (!filters.occasion || item.occasion === filters.occasion)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-3 rounded-xl shadow-lg mx-auto w-fit mb-4">
            <Crown className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-slate-600">Loading your wardrobe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-2 md:p-2.5 rounded-xl shadow-lg">
                <Crown className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                  ClosetIQ
                </h1>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">Smart Wardrobe Assistant</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2 bg-slate-100 rounded-xl px-3 py-2">
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">{user?.email}</span>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 md:p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors touch-manipulation"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 md:p-2.5 rounded-xl transition-all duration-200 touch-manipulation ${
                  showFilters 
                    ? 'bg-indigo-100 text-indigo-600 shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Filter className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => setShowCapture(true)}
                className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl flex items-center space-x-2 hover:from-indigo-700 hover:to-violet-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium touch-manipulation"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-sm md:text-base">Add</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-6">
        <div className="flex space-x-1 bg-white/70 backdrop-blur-sm rounded-2xl p-1 md:p-1.5 w-full overflow-x-auto shadow-sm border border-slate-200/50">
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap touch-manipulation ${
              activeTab === 'wardrobe'
                ? 'bg-white text-indigo-700 shadow-lg border border-slate-200/50'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-sm md:text-base">My Closet</span>
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap touch-manipulation ${
              activeTab === 'planner'
                ? 'bg-white text-indigo-700 shadow-lg border border-slate-200/50'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-white/50'
            }`}
          >
            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-sm md:text-base">Weekly Plan</span>
          </button>
          <button
            onClick={() => setActiveTab('occasions')}
            className={`flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap touch-manipulation ${
              activeTab === 'occasions'
                ? 'bg-white text-indigo-700 shadow-lg border border-slate-200/50'
                : 'text-slate-600 hover:text-indigo-600 hover:bg-white/50'
            }`}
          >
            <Crown className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-sm md:text-base">Occasions</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8 pb-8 md:pb-12">
        {activeTab === 'wardrobe' ? (
          <div className="space-y-6">
            {showFilters && (
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
            )}
            <WardrobeGrid items={filteredLegacyItems} onDeleteItem={deleteClothingItem} />
          </div>
        ) : activeTab === 'planner' ? (
          <WeeklyPlanner clothingItems={legacyClothes} />
        ) : (
          <OccasionPlanner clothingItems={legacyClothes} />
        )}
      </main>

      {/* Modals */}
      {showCapture && (
        <CaptureModal onClose={() => setShowCapture(false)} />
      )}
    </div>
  );
};

export default Index;
