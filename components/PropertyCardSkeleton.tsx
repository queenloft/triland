import React from 'react';

export const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Image Area */}
      <div className="relative h-56 w-full bg-slate-200 animate-pulse">
        <div className="absolute top-4 left-4 w-20 h-6 bg-slate-300 rounded-md"></div>
        <div className="absolute bottom-4 left-4 w-32 h-6 bg-slate-300 rounded-md"></div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <div className="h-6 bg-slate-200 rounded animate-pulse w-3/4 mb-3"></div>
        
        {/* Location */}
        <div className="flex items-center mb-6">
          <div className="w-4 h-4 rounded-full bg-slate-200 mr-2"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-50 mt-auto">
          <div className="flex flex-col items-center gap-1">
            <div className="w-5 h-5 bg-slate-200 rounded"></div>
            <div className="w-10 h-3 bg-slate-200 rounded"></div>
          </div>
          <div className="flex flex-col items-center gap-1 border-l border-gray-50">
            <div className="w-5 h-5 bg-slate-200 rounded"></div>
            <div className="w-10 h-3 bg-slate-200 rounded"></div>
          </div>
          <div className="flex flex-col items-center gap-1 border-l border-gray-50">
            <div className="w-5 h-5 bg-slate-200 rounded"></div>
            <div className="w-10 h-3 bg-slate-200 rounded"></div>
          </div>
        </div>
        
        {/* Button */}
        <div className="w-full mt-4 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
};