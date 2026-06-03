"use client";

import React from "react";
import { MapPinOff } from "lucide-react";

const EmptyState = ({ 
  title = "No pharmacies found",
  description = "Try adjusting your search or location",
}) => {
  return (
    <div className="py-20 flex flex-col items-center text-center">
      {/* Icon */}
      <div className="bg-pink-50 text-pink-500 p-4 rounded-full mb-4">
        <MapPinOff size={32} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 max-w-sm">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;