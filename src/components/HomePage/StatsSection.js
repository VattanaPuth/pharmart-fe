import React from 'react';
import { ShieldCheck, Package, TrendingUp, Clock } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      id: 1,
      icon: <ShieldCheck className="w-6 h-6 text-pink-500" />,
      value: "3+",
      label: "Verified Pharmacies",
     
    },
    {
      id: 2,
      icon: <Package className="w-6 h-6 text-pink-500" />,
      value: "17+",
      label: "Products Listed",
     
    },
    {
      id: 3,
      icon: <TrendingUp className="w-6 h-6 text-pink-500" />,
      value: "1,200+",
      label: "Orders Fulfilled",
     
    },
    {
      id: 4,
      icon: <Clock className="w-6 h-6 text-pink-500" />,
      value: "< 2 hrs",
      label: "Avg. Processing",
     
    },
  ];

  return (
    <div className="w-full py-8 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.id} 
              className={`flex items-center space-x-4 px-6 ${
                index !== stats.length - 1 ? 'lg:border-r border-gray-100' : ''
              }`}
            >
              {/* Icon Container */}
              <div className={`p-3 rounded-xl`}>
                {stat.icon}
              </div>
              
              {/* Text Content */}
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 leading-tight">
                  {stat.value}
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;