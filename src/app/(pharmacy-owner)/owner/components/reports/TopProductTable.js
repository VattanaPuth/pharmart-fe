import React from "react";

const TopProductsTable = ({ products = [], loading = false }) => {
  return (
    <div className="p-6 bg-slate-50">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-slate-800">
            Top Products by Revenue
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            <thead>
              <tr className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Rank</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium text-right">Qty Sold</th>
                <th className="px-6 py-4 font-medium text-right">Revenue</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">

              {/* Loading skeleton */}
              {loading && (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-40"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div>
                    </td>
                  </tr>
                ))
              )}

              {/* Data */}
              {!loading &&
                products.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Rank */}
                    <td className="px-6 py-4">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          item.rank === 1
                            ? "bg-amber-100 text-amber-600"
                            : item.rank === 2
                            ? "bg-slate-100 text-slate-600"
                            : item.rank === 3
                            ? "bg-orange-100 text-orange-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {item.rank}
                      </span>
                    </td>

                    {/* Product name */}
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {item.name}
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4 text-sm text-slate-500 text-right">
                      {item.qty} units
                    </td>

                    {/* Revenue */}
                    <td className="px-6 py-4 text-sm font-bold text-[#F06292] text-right">
                      ${item.revenue}
                    </td>
                  </tr>
                ))}

              {/* Empty state */}
              {!loading && products.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-10 text-slate-400 text-sm"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default TopProductsTable;