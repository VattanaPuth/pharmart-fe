import React from "react";

const StatsCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="relative bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden">
      
      {/* Content */}
      <div className="relative z-10">
        <div className="text-sm text-gray-500 mb-1">
          {title}
        </div>
        <div className="text-2xl font-semibold text-gray-900 tracking-tight">
          {value}
        </div>
      </div>

      {/* Floating Icon */}
      {Icon && (
        <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-[#FFF1F5] flex items-center justify-center">
          <Icon className="w-10 h-10 text-[#F06292]" strokeWidth={1.5} />
        </div>
      )}

    </div>
  );
};

export default StatsCard;