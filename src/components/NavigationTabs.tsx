
import React from 'react';
import { Sparkles, Calendar, Crown } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: 'wardrobe' | 'planner' | 'occasions';
  onTabChange: (tab: 'wardrobe' | 'planner' | 'occasions') => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-6">
      <div className="flex space-x-1 bg-white/70 backdrop-blur-sm rounded-2xl p-1 md:p-1.5 w-full overflow-x-auto shadow-sm border border-slate-200/50">
        <button
          onClick={() => onTabChange('wardrobe')}
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
          onClick={() => onTabChange('planner')}
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
          onClick={() => onTabChange('occasions')}
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
  );
};

export default NavigationTabs;
