"use client";

import React from "react";
import { getStorageUrl } from "@/lib/media";

const WarningIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f97316"
    strokeWidth="2"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f97316"
    strokeWidth="2"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" />
  </svg>
);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function DashboardAlerts({ data, pending_orders ,low_stock_products, near_expiry_products}) {
  const pendingOrders = pending_orders || [];
  const lowStock = low_stock_products || [];
  const nearExpiry = near_expiry_products || [];

  return (
    <div className="flex flex-col w-full gap-y-3">
      <div className="w-[98%] mx-auto font-sans bg-slate-50 p-6 rounded-3xl mt-2">
        {/* HEADER */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-orange-50 p-4 rounded-2xl border border-orange-200">
            <div className="font-bold">
              {lowStock.length} Low Stock Products
            </div>
          </div>

          <div className="flex-1 bg-orange-50 p-4 rounded-2xl border border-orange-200">
            <div className="font-bold">
              {nearExpiry.length} Near Expiry or Expired Products
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-5">
          {/* Low Stock */}
          <div className="bg-white rounded-2xl p-4">
            <h3 className="font-bold mb-3">Low Stock</h3>

            {lowStock.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={getStorageUrl(p.main_image, "/placeholder.png")}
                    alt={p.product_name}
                    className="h-12 w-12 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{p.product_name}</div>
                    <div className="text-xs text-gray-400">
                      {p.form || p.strength || "Product"}
                    </div>
                  </div>
                </div>
                <div className="text-orange-500 font-bold">
                  {p.stock_quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Near Expiry */}
          <div className="col-span-2 bg-white rounded-2xl p-4">
            <h3 className="font-bold mb-3">Near Expiry</h3>

            {nearExpiry.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={getStorageUrl(p.main_image, "/placeholder.png")}
                    alt={p.product_name}
                    className="h-12 w-12 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{p.product_name}</div>
                  <div className="text-xs text-gray-400">{p.package_name}</div>
                  </div>
                </div>

                <div className="text-orange-600 font-bold">
                  Exp: {formatDate(p.expiry_date)}
                </div>
                <div className="text-orange-600 font-bold">
                  ({p.expiry_status})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="w-[50%] bg-white rounded-2xl p-4 mx-auto">
        <h3 className="font-bold mb-3">Pending Orders</h3>

        {pendingOrders.length === 0 ? (
          <p>No pending orders</p>
        ) : (
          pendingOrders.map((o) => (
            <div key={o.order_id} className="flex justify-between py-2">
              <div>
                <div className="font-semibold">{o.order_number}</div>
                <div className="text-xs text-gray-400">{o.customer_name}</div>
              </div>
              <div className="text-orange-500 font-bold">${o.amount}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
