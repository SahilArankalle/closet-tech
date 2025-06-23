
import React from 'react';
import { X } from 'lucide-react';
import { Filters } from '../types/wardrobe';

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
  const clearFilters = () => {
    onFiltersChange({
      category: '',
      color: '',
      season: '',
      occasion: ''
    });
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900">Filter Your Closet</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            <X className="w-3 h-3" />
            <span>Clear ({activeFiltersCount})</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900 font-medium"
          >
            <option value="">All Categories</option>
            <option value="top">Tops</option>
            <option value="bottom">Bottoms</option>
            <option value="shoes">Shoes</option>
            <option value="accessory">Accessories</option>
            <option value="outerwear">Outerwear</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Color</label>
          <input
            type="text"
            value={filters.color}
            onChange={(e) => updateFilter('color', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900 font-medium"
            placeholder="Any color"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Season</label>
          <select
            value={filters.season}
            onChange={(e) => updateFilter('season', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900 font-medium"
          >
            <option value="">All Seasons</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
            <option value="winter">Winter</option>
            <option value="all">All Season</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Occasion</label>
          <select
            value={filters.occasion}
            onChange={(e) => updateFilter('occasion', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-slate-900 font-medium"
          >
            <option value="">All Occasions</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="business">Business</option>
            <option value="sport">Sport</option>
            <option value="party">Party</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
