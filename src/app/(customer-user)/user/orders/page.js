"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import OrderCard from "@/components/OrdersPage/OrderCard";


// =========================
// SKELETON
// =========================
const OrderSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-xl p-4 animate-pulse">
    <div className="flex justify-between mb-3">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-3 w-48 bg-gray-100 rounded"></div>
      </div>

      <div className="text-right space-y-2">
        <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-3 w-16 bg-gray-100 rounded"></div>
      </div>
    </div>

    <div className="border-t border-gray-50 pt-3 space-y-2">
      <div className="h-3 w-full bg-gray-100 rounded"></div>
      <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
    </div>

    <div className="flex justify-between mt-4">
      <div className="h-6 w-24 bg-gray-100 rounded"></div>
      <div className="h-5 w-16 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// =========================
// MAIN
// =========================
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const tabs = [
    "All",
    "Pending",
    "Confirmed",
    "Ready",
    "Completed",
    "Cancelled",
    "Declined",
    "Refund Processing",
    "Refunded",
  ];

  // =========================
  // BUILD QUERY PARAMS
  // =========================
  const getParams = (tab) => {
    switch (tab) {
      case "Refund Processing":
        return { refund_status: "requested" };

      case "Refunded":
        return { refund_status: "refunded" };

      case "All":
        return {};

      default:
        return { status: tab.toLowerCase() };
    }
  };

  // =========================
  // FETCH
  // =========================
  const fetchOrders = async (pageNumber = 1, tab = activeTab) => {
    try {
      setLoading(true);

      const params = getParams(tab);

      const query = new URLSearchParams({
        page: pageNumber,
        ...params,
      }).toString();

      const res = await api.get(`/customer/order/read?${query}`);

      setOrders(res.data?.data || []);
      setPage(res.data?.current_page || 1);
      setLastPage(res.data?.last_page || 1);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);

      let url = `/customer/order/read?page=${page}`;

      if (activeTab !== "All") {
        if (activeTab === "Refund Processing") {
          url += `&refund_status=requested`;
        } else if (activeTab === "Refunded") {
          url += `&refund_status=refunded`;
        } else {
          url += `&status=${activeTab}`;
        }
      }

      const res = await api.get(url);

      setOrders(res.data?.data || []);
      setLastPage(res.data?.last_page || 1);
      setPage(res.data?.current_page || 1);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [activeTab, page]);

  // initial load
  useEffect(() => {
    fetchOrders(1, activeTab);
  }, []);

  // =========================
  // TAB CLICK
  // =========================
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchOrders(1, tab);
  };

  // =========================
  // UI
  // =========================
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6">
      {/* HEADER */}
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>
        <p className="text-slate-400 text-sm">{orders.length} orders</p>
      </header>

      {/* TABS */}
      <nav className="sticky top-0 z-30 bg-[#f8fafc] py-3 border-b mb-4">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeTab === tab
                  ? "bg-[#f06292] text-white"
                  : "bg-white border text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* LIST */}
      <section className="max-w-3xl mx-auto space-y-4 pb-10">
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}

        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading &&
          !error &&
          orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}

        {!loading && orders.length === 0 && (
          <p className="text-gray-400 text-center">No orders found</p>
        )}
      </section>

      {/* PAGINATION */}
      {!loading && orders.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => fetchOrders(page - 1, activeTab)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {lastPage}
          </span>

          <button
            disabled={page === lastPage}
            onClick={() => fetchOrders(page + 1, activeTab)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
};

export default MyOrders;