"use client";
import React from "react";

export default function PendingKYCSection({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Pending eKYC Reviews
        </h3>

        <button className="text-sm text-[#F06292] hover:opacity-80">
          View all →
        </button>
      </div>

      {/* List */}
      {data?.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-4 hover:bg-gray-50 rounded-lg transition"
            >
              
              {/* Left */}
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                />

                <div>
                  <p className="font-medium text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.owner}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                <span className="text-xs bg-[#FFF1F5] text-[#F06292] px-2 py-1 rounded-full">
                  eKYC review
                </span>

                <p className="text-xs text-gray-500 mt-1">
                  {item.progress}%
                </p>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          No pending reviews
        </p>
      )}
    </div>
  );
}