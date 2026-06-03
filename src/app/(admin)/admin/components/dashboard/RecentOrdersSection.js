"use client";
import React from "react";

export default function RecentOrdersSection({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Refund Requests
        </h3>

        <button className="text-sm text-[#F06292] hover:opacity-80">
          View all →
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {data?.length > 0 ? (
          data.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-none"
            >
              
              {/* Left */}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {order.id}
                </p>
                <p className="text-xs text-gray-500">
                  {order.pharmacy}
                </p>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  ${order.amount}
                </p>

                <span className="text-xs px-2 py-1 rounded-full bg-[#FFF1F5] text-[#F06292]">
                  {order.status}
                </span>
              </div>

            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">
            No recent refund requests
          </p>
        )}
      </div>

    </div>
  );
}