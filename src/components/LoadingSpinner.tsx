import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4 py-12">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
    <p className="text-lg text-orange-700 font-semibold">Prepping the kitchen...</p>
  </div>
);

export default LoadingSpinner;