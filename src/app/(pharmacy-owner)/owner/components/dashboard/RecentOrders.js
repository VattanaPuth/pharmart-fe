"use client";

import Link from "next/link";

const STATUS_STYLES = {
  Delivering: "bg-teal-50 text-teal-600",
  Ready: "bg-violet-50 text-violet-600",
  Cancelled: "bg-slate-100 text-slate-500",
  Confirmed: "bg-blue-50 text-blue-600",
  Refunded: "bg-pink-50 text-pink-600",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
      STATUS_STYLES[status] ?? "bg-slate-100 text-slate-500"
    }`}
  >
    {status}
  </span>
);

const normalizeStatus = (status) => {
  switch (status) {
    case "pending":
      return "Ready";
    case "confirmed":
      return "Confirmed";
    case "ready":
      return "Ready";
    case "delivering":
      return "Delivering";
    case "cancelled":
      return "Cancelled";
    case "refunded":
      return "Refunded";
    default:
      return status;
  }
};

export default function RecentOrders({ data }) {
  const orders = data?.data || [];

  return (
    <div className="w-[98%] mx-auto font-sans bg-slate-50 p-4 md:p-6 rounded-3xl mt-2">

      {/* HEADER */}
      <div className="flex justify-between items-center px-2 md:px-6 pt-3 md:pt-5 pb-3 md:pb-4">
        <h2 className="text-[16px] md:text-[17px] font-bold text-slate-900">
          Recent Orders
        </h2>

        <Link
          href={"/owner/orders"}
          className="text-[13px] font-semibold text-pink-500 hover:underline"
        >
          View all →
        </Link>
      </div>

      {/* =========================
          MOBILE CARDS
      ========================= */}
      <div className="md:hidden space-y-3">
        {orders.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            No orders found
          </div>
        ) : (
          orders.map((order) => {
            const isRefunded = order.is_refunded;
            const statusLabel = isRefunded
              ? "Refunded"
              : normalizeStatus(order.status);

            return (
              <div
                key={order.order_id}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-pink-500">
                      {order.order_number}
                    </div>
                    <div className="text-sm text-slate-500">
                      {order.customer_name}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-slate-800">
                      ${Number(order.amount || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {order.date}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge status={statusLabel} />

                  {isRefunded && (
                    <span className="text-[11px] bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                      REFUND
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =========================
          DESKTOP TABLE
      ========================= */}
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-y border-slate-100 bg-slate-50/60">
              {["Order", "Customer", "Amount", "Status", "Date"].map(
                (col) => (
                  <th
                    key={col}
                    className="px-6 py-2.5 text-left text-[11.5px] font-semibold text-slate-400"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const isRefunded = order.is_refunded;
              const statusLabel = isRefunded
                ? "Refunded"
                : normalizeStatus(order.status);

              return (
                <tr
                  key={order.order_id}
                  className="border-b border-slate-50 hover:bg-pink-50/30"
                >
                  <td className="px-6 py-3.5 text-pink-500 font-semibold">
                    {order.order_number}
                  </td>

                  <td className="px-6 py-3.5">
                    {order.customer_name}
                  </td>

                  <td className="px-6 py-3.5 font-medium">
                    ${Number(order.amount || 0).toFixed(2)}
                  </td>

                  <td className="px-6 py-3.5">
                    <StatusBadge status={statusLabel} />

                    {isRefunded && (
                      <span className="ml-2 text-[11px] bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                        REFUND
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-3.5 text-slate-400">
                    {order.date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}