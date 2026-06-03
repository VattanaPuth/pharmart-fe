import React from "react";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

const StatsGrid = ({ stats = {}, loading = false }) => {

  const data = [
    {
      label: "Revenue",
      value: `$${stats?.revenue ?? 0}`,
      subtext: `from ${stats?.total_completed ?? 0} completed orders`,
      icon: <DollarSign size={20} />,
      iconBg: "bg-pink-50",
      iconColor: "text-pink-400",
    },
    {
      label: "Total Orders",
      value: stats?.total_orders ?? 0,
      subtext: `${stats?.pending_orders ?? 0} pending`,
      icon: <ShoppingBag size={20} />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "Avg. Order Value",
      value: `$${stats?.avg_order_value ?? 0}`,
      subtext: "per completed order",
      icon: <TrendingUp size={20} />,
      iconBg: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      label: "Refunded",
      value: `$${stats?.refund_amount ?? 0}`,
      subtext: `${stats?.refunded_orders ?? 0} orders`,
      icon: <RefreshCw size={20} />,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-white rounded-2xl border animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50">
      {data.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4"
        >
          {/* Icon */}
          <div
            className={`w-10 h-10 ${stat.iconBg} ${stat.iconColor} rounded-xl flex items-center justify-center`}
          >
            {stat.icon}
          </div>

          {/* Content */}
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              {stat.value}
            </h3>

            <div>
              <p className="text-sm font-medium text-slate-500">
                {stat.label}
              </p>
              <p className="text-xs text-slate-400">
                {stat.subtext}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;