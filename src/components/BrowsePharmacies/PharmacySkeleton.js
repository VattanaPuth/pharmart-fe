"use client";

import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      {/* Image */}
      <div className="h-48 w-full bg-slate-200" />

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />

        <div className="flex justify-between pt-4">
          <div className="h-3 bg-slate-200 rounded w-20" />
          <div className="h-3 bg-slate-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

const PharmacySkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default PharmacySkeleton;