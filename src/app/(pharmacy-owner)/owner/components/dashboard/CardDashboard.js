"use client";

import {
  Package,
  Clock,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

export default function CardDashboard({ data }) {
  const summary = data || {};

  const cards = [
    {
      title: "Total Products",
      value: summary?.total_products ?? 0,
      icon: <Package size={56} className=" text-blue-500" />,
    },
    {
      title: "Pending Orders",
      value: summary?.pending_orders ?? 0,
      icon: <Clock size={56} className=" text-yellow-500" />,
    },
    {
      title: "Total Orders",
      value: summary?.total_orders ?? 0,
      icon: <ClipboardList size={56} className=" text-green-500" />,
    },
    {
      title: "Net Revenue",
      value: `$${summary?.net_revenue ?? 0}`,
      icon: <TrendingUp size={56} className=" text-purple-500" />,
    },
  ];

return (
  <div className="flex flex-wrap gap-4 p-4">
    {cards.map((item, index) => (
<div
  key={index}
  className="
    relative bg-white rounded-xl shadow-md border
    flex items-center gap-4
    p-4
    sm:w-[48%] lg:w-[23%]
    hover:shadow-lg transition-all duration-300
    overflow-hidden
  "
>
  {/* background icon */}
  <div className="absolute -right-2 bottom-4 text-gray-300  opacity-30  pointer-events-none z-0">
    {item.icon}
  </div>

  {/* content */}
  <div className="relative z-10 min-w-0">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-700 truncate">
      {item.value}
    </h2>
    <p className="text-gray-500 text-sm truncate">
      {item.title}
    </p>
  </div>
</div>
    ))}
  </div>
);
}