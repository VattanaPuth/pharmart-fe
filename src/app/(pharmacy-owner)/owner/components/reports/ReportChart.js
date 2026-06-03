"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const OrderItem = ({ label, count, colorClass }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-slate-500 text-sm font-medium">{label}</span>
    <span
      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${colorClass}`}
    >
      {count}
    </span>
  </div>
);

const ReportChart = ({
  selectedFilter,
  startDate,
  endDate,
  chart = [],
  breakdown = {},
}) => {
  /*
  |--------------------------------------------------------------------------
  | USE API DATA (NO RANDOM DATA ANYMORE)
  |--------------------------------------------------------------------------
  */

  const data = useMemo(() => {
    return chart ?? [];
  }, [chart]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-slate-50">

      {/* Revenue Chart */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

        <h2 className="text-lg font-bold text-slate-800 mb-8">
          Revenue Overview
        </h2>

     <div className="w-full min-h-75 h-[40vh]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={data}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />

              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />

              <YAxis tickFormatter={(value) => `$${value}`} />

              <Bar
                dataKey="revenue"
                fill="#F06292"
                radius={[4, 4, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>
      </div>

      {/* Order Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">

        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Order Breakdown
        </h2>

        <div className="grow flex flex-col justify-between">

          <div className="divide-y divide-slate-50">

            <OrderItem
              label="Completed"
              count={breakdown?.completed ?? 0}
              colorClass="bg-green-100 text-green-600"
            />

            <OrderItem
              label="Pending"
              count={breakdown?.pending ?? 0}
              colorClass="bg-orange-100 text-orange-600"
            />

            <OrderItem
              label="Confirmed"
              count={breakdown?.confirmed ?? 0}
              colorClass="bg-blue-100 text-blue-600"
            />

            <OrderItem
              label="Ready"
              count={breakdown?.ready ?? 0}
              colorClass="bg-purple-100 text-purple-600"
            />

<OrderItem
  label="Delivering"
  count={breakdown?.delivering ?? 0}
  colorClass="bg-indigo-100 text-indigo-600"
/>

            <OrderItem
              label="Cancelled"
              count={breakdown?.cancelled ?? 0}
              colorClass="bg-slate-100 text-slate-600"
            />

            <OrderItem
              label="Refunded"
              count={breakdown?.refunded ?? 0}
              colorClass="bg-pink-100 text-pink-600"
            />

          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">

            <span className="text-slate-500 font-medium">
              Total Orders
            </span>

            <span className="text-slate-800 font-bold">
              {breakdown?.total ?? 0}
            </span>

          </div>

        </div>
      </div>

    </div>
  );
};

export default ReportChart;