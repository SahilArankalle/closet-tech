
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <p className="text-red-700">{error}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
