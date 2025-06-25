
import React from 'react';
import { Crown } from 'lucide-react';

const LoadingScreen: React.FC = () => {
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
};

export default LoadingScreen;
