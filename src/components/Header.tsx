
import React from 'react';
import { Filter, Plus, Crown, LogOut, User } from 'lucide-react';

interface HeaderProps {
  userEmail?: string;
  showFilters: boolean;
  onToggleFilters: () => void;
  onShowCapture: () => void;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userEmail,
  showFilters,
  onToggleFilters,
  onShowCapture,
  onSignOut
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40 shadow-sm">
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
                <span className="text-sm text-slate-700">{userEmail}</span>
              </div>
              <button
                onClick={onSignOut}
                className="p-2 md:p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors touch-manipulation"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <button
              onClick={onToggleFilters}
              className={`p-2 md:p-2.5 rounded-xl transition-all duration-200 touch-manipulation ${
                showFilters 
                  ? 'bg-indigo-100 text-indigo-600 shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Filter className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={onShowCapture}
              className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl flex items-center space-x-2 hover:from-indigo-700 hover:to-violet-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium touch-manipulation"
            >
              <Plus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-sm md:text-base">Add</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
