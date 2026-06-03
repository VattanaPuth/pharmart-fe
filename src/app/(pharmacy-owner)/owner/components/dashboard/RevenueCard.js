"use client";

import { TrendingUp, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function RevenueCard({ initialData }) {
  const [activePeriod, setActivePeriod] = useState("today");
  const [loading, setLoading] = useState(true);

  const [revenueData, setRevenueData] = useState(
    initialData || {
      revenue: 0,
      gross_revenue: 0,
      refunded_amount: 0,
      order_count: 0,
    },
  );

  const periods = [
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "last_7_days" },
    { label: "This Month", value: "this_month" },
    { label: "Full Report", value: "all_time" },
  ];

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/owner/dashboard/revenue?period=${activePeriod}`,
        );

        setRevenueData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch revenue", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [activePeriod]);

  return (
    <div className="w-[98%] mx-auto font-sans bg-slate-50 p-4 sm:p-6 rounded-3xl mt-2">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {/* title */}
        <div className="flex items-center gap-2">
          <TrendingUp className="text-yellow-500" size={22} />
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Revenue by Period
          </h2>
        </div>

        {/* buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setActivePeriod(period.value)}
              className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition ${
                activePeriod === period.value
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {period.label}
            </button>
          ))}

          <Calendar className="text-gray-400" size={18} />
        </div>
      </div>

      {/* body */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : (
        <>
          {/* top stats */}
          <div className="flex flex-col sm:flex-row  gap-4 mb-6">
            <div className="bg-white p-3 rounded-xl shadow-sm w-full sm:w-auto">
              <p className="text-xs sm:text-sm text-gray-500">Net Revenue</p>
              <p className="text-xl sm:text-2xl font-bold">
                ${revenueData.revenue}
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm w-full sm:w-auto">
              <p className="text-xs sm:text-sm text-gray-500">Orders</p>
              <p className="text-xl sm:text-2xl font-bold">
                {revenueData.order_count}
              </p>
            </div>
          </div>

          {/* bottom stats */}
          <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-600">
            <div className="bg-white p-3 rounded-xl w-full">
              Gross:
              <span className="font-semibold ml-1">
                ${revenueData.gross_revenue}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl w-full">
              Refunded:
              <span className="font-semibold ml-1 text-red-500">
                -${revenueData.refunded_amount}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
