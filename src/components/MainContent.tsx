
import React from 'react';
import WardrobeGrid from './WardrobeGrid';
import WeeklyPlanner from './WeeklyPlanner';
import OccasionPlanner from './OccasionPlanner';
import FilterPanel from './FilterPanel';
import { ClothingItem, Filters } from '../types/wardrobe';

interface MainContentProps {
  activeTab: 'wardrobe' | 'planner' | 'occasions';
  showFilters: boolean;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  filteredItems: ClothingItem[];
  allItems: ClothingItem[];
  onDeleteItem: (id: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  activeTab,
  showFilters,
  filters,
  onFiltersChange,
  filteredItems,
  allItems,
  onDeleteItem
}) => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8 pb-8 md:pb-12">
      {activeTab === 'wardrobe' ? (
        <div className="space-y-6">
          {showFilters && (
            <FilterPanel filters={filters} onFiltersChange={onFiltersChange} />
          )}
          <WardrobeGrid items={filteredItems} onDeleteItem={onDeleteItem} />
        </div>
      ) : activeTab === 'planner' ? (
        <WeeklyPlanner clothingItems={allItems} />
      ) : (
        <OccasionPlanner clothingItems={allItems} />
      )}
    </main>
  );
};

export default MainContent;
