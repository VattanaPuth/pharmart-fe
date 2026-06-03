import React from "react";
import { Star } from "lucide-react";

export default function ReviewsOverviewSection({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Reviews Overview
        </h3>
        <button className="text-sm text-pink-500 hover:underline">
          Manage →
        </button>
      </div>

      {/* AVERAGE */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl font-bold text-gray-900">
          {data.rating?.toFixed?.(1) || "0.0"}
        </div>

        <div>
          <div className="flex items-center gap-1 text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.round(data.rating) ? "currentColor" : "none"}
              />
            ))}
          </div>

          <p className="text-sm text-gray-500">
            Avg. from {data.totalReviews} reviews
          </p>
        </div>
      </div>

      {/* DISTRIBUTION */}
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const item = data.distribution?.[star] || {};

          return (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm w-6 text-gray-600">{star}★</span>

              <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all"
                  style={{ width: `${item.percentage || 0}%` }}
                />
              </div>

              <span className="text-xs w-8 text-right text-gray-500">
                {item.count || 0}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}