import React from 'react';

const OrdersTable = () => {
  const orders = [
    { id: 'ORD-2026-021', date: 'Feb 23, 2026', items: 'Vitamin D3 Softgels', amount: '$37.98', status: 'cancel_requested' },
    { id: 'ORD-2026-016', date: 'Feb 22, 2026', items: 'Paracetamol Tablets, Loratadine Tablets', amount: '$20.97', status: 'completed' },
    { id: 'ORD-2026-019', date: 'Feb 22, 2026', items: 'Loratadine Tablets, Vitamin D3 Softgels', amount: '$36.97', status: 'completed' },
    { id: 'ORD-2026-020', date: 'Feb 21, 2026', items: 'Paracetamol Tablets', amount: '$5.99', status: 'cancelled' },
    { id: 'ORD-2026-022', date: 'Feb 20, 2026', items: 'Paracetamol Tablets, Ibuprofen Tablets', amount: '$25.46', status: 'refund_requested' },
    { id: 'ORD-2026-010', date: 'Feb 8, 2026', items: 'Amoxicillin Capsules, Paracetamol Tablets', amount: '$49.48', status: 'ready' },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'cancel_requested':
      case 'refund_requested': return 'bg-purple-100 text-purple-600';
      case 'ready': return 'bg-indigo-100 text-indigo-600';
      case 'cancelled': return 'bg-slate-200 text-slate-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="p-6 bg-slate-50">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Orders in Period (6)</h2>
          <span className="text-xs font-medium text-slate-300">2/1/2026 — 2/24/2026</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-50">
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Amount Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 text-sm font-medium text-slate-700">
                    {order.id}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 max-w-xs truncate">
                    {order.items}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-800">{order.amount}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${getStatusStyles(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;