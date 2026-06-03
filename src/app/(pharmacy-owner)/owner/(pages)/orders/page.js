"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

import OrderDetail from "../../components/products/OrderDetail";

import {
  Check,
  X,
  Eye,
  Truck,
  RotateCcw,
  Store,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";

const tabs = [
  "All Orders",
  "Pending",
  "Confirmed",
  "Ready",
  "Delivering",
  "Completed",
  "Declined",
  "Refund Requested",
  "Returning",
  "Cancelled",
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Delivering: "bg-cyan-100 text-cyan-700",
  Ready: "bg-purple-100 text-purple-700",
  Declined: "bg-red-100 text-red-700",
  Returning: "bg-sky-100 text-sky-700",
  Completed: "bg-green-100 text-green-700",
  Confirmed: "bg-blue-100 text-blue-700",
};

export default function Home() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("All Orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get("/owner/orders");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };
  // =========================
  // FETCH ORDERS
  // =========================
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchOrders();
    } finally {
      setRefreshing(false);
    }
  };

  // =========================
  // FILTER
  // =========================
  const filteredOrders =
    activeTab === "All Orders"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  // =========================
  // DETAIL PAGE
  // =========================
  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  if (loading) {
    return <div className="p-10 text-gray-500">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb]">
      <div className="p-6">
        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Orders</h1>

          <p className="mt-1 text-sm text-gray-500">
            {filteredOrders.length} total orders
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm"
        >
          <RefreshCcw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>

        {/* TABS */}
        <div className="mt-6 mb-6 flex flex-wrap gap-3">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "border-pink-500 bg-pink-500 text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab}

              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab
                    ? "bg-pink-400 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab === "All Orders"
                  ? orders.length
                  : orders.filter((o) => o.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
    <table className="min-w-full">
  {/* HEADER */}
  <thead className="hidden md:table-header-group border-b bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
    <tr>
      <th className="px-6 py-4">Order</th>
      <th className="px-6 py-4">Customer</th>
      <th className="px-6 py-4">Amount</th>
      <th className="px-6 py-4">Status</th>
      <th className="px-6 py-4">Date</th>
      <th className="px-6 py-4">Action</th>
    </tr>
  </thead>

  {/* BODY */}
  <tbody>
    {filteredOrders.map((order) => (
      <tr
        key={order.id}
        className="block md:table-row border-b border-gray-100 hover:bg-gray-50"
      >
        <td colSpan={6} className="block md:table-cell p-4 md:p-0">
          {/* MOBILE */}
          <div className="md:hidden space-y-4">
            {/* TOP */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-pink-500">
                  {order.order_id} (NO#{order.order_number})
                </div>

                <div className="mt-1 text-sm font-medium text-gray-800">
                  {order.customer?.name}
                </div>

                <div className="text-xs text-gray-400">
                  {order.customer?.phone}
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                  statusColors[order.status] ||
                  "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-gray-400">
                  Amount
                </div>

                <div className="font-semibold text-gray-800">
                  ${order.amount}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400">
                  Date
                </div>

                <div className="text-gray-600">
                  {order.date}
                </div>
              </div>
            </div>

            {/* ACTION */}
            <div className="pt-2 border-t border-gray-100">
              <Link
                href={`/owner/orders/${order.id}`}
                className="flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                <Eye size={14} />
                View Order
              </Link>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:grid md:grid-cols-6 items-center">
            {/* ORDER */}
            <div className="px-6 py-5 font-semibold text-pink-500">
              {order.order_id} (#{order.order_number})
            </div>

            {/* CUSTOMER */}
            <div className="px-6 py-5">
              <div className="font-medium text-gray-800">
                {order.customer?.name}
              </div>

              <div className="text-xs text-gray-400">
                {order.customer?.phone}
              </div>
            </div>

            {/* AMOUNT */}
            <div className={`px-6 py-5 font-semibold ${order.refund_status == "refunded" || order.status== "Declined"? "text-red-600": "text-gray-800"} `}>
              ${order.amount}
            </div>

            {/* STATUS */}
            <div className="px-6 py-5">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  statusColors[order.status] ||
                  "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status}
              </span>

              {order.refund_status? <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-red-600"
                `}
              >
                refund status: {order.refund_status}
              </span>:<></>}
            </div>

            {/* DATE */}
            <div className="px-6 py-5 text-gray-500">
              {order.date}
            </div>

            {/* ACTION */}
            <div className="px-6 py-5">
              <Link
                href={`/owner/orders/${order.id}`}
                className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs text-gray-600 hover:bg-gray-100"
              >
                <Eye size={14} />
                View
              </Link>
            </div>
          </div>
        </td>
      </tr>
    ))}

    {/* EMPTY */}
    {filteredOrders.length === 0 && (
      <tr>
        <td
          colSpan="6"
          className="py-10 text-center text-gray-400"
        >
          No orders found
        </td>
      </tr>
    )}
  </tbody>
</table>
        </div>
      </div>
    </div>
  );
}
