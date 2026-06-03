"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Eye, Truck, Store } from "lucide-react";
import Link from "next/link";

const tabs = [
  "All",
  "requested",
  "approved",
  "returning",
  "verified",
  "refunded",
  "canceled",
];

const statusColors = {
  requested: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  returning: "bg-purple-100 text-purple-700",
  verified: "bg-cyan-100 text-cyan-700",
  refunded: "bg-green-100 text-green-700",
  canceled: "bg-red-100 text-red-700",
};

export default function RefundingOrders() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const res = await api.get("/owner/refunds/read");
        setRefunds(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  const filteredRefunds =
    activeTab === "All"
      ? refunds
      : refunds.filter((r) => r.status === activeTab);

  if (loading) {
    return <div className="p-10 text-gray-500">Loading refunds...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb] p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Refund Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          {filteredRefunds.length} refund requests
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-2 flex-wrap mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              activeTab === tab
                ? "bg-pink-500 text-white border-pink-500"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="hidden md:table-header-group bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-4">Refund</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Products</th>
              <th className="p-4">Evidence</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRefunds.map((r) => (
              <tr
                key={r.id}
                className="
            border-b hover:bg-gray-50
            block md:table-row
            p-4 md:p-0
          "
              >
                {/* REFUND */}
                <td className="p-4 md:table-cell block">
                  <div className="font-bold text-pink-600">
                    {r.refund_number}
                  </div>
                  <div className="text-xs text-gray-400">{r.reason}</div>
                </td>

                {/* CUSTOMER */}
                <td className="p-4 md:table-cell block">
                  <div className="font-semibold text-gray-800">
                    {r.customer?.information?.customer_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {r.customer?.information?.phone_number}
                  </div>
                </td>

                {/* PRODUCTS (STACKED ON MOBILE) */}
                <td className="p-4 md:table-cell block">
                  <div className="flex flex-col gap-2">
                    {r.items?.map((item) => (
                      <div key={item.id} className="border rounded-lg p-2">
                        <div className="font-medium text-gray-800">
                          {item.product?.product_name}
                        </div>

                        <div className="text-xs text-gray-500">
                          Qty: {item.quantity} • ${item.unit_price}
                        </div>

                        <div className="text-xs text-gray-400">
                          {item.product?.owner_setting?.pharmacy_name}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>

                {/* EVIDENCE (HORIZONTAL SCROLL ON MOBILE) */}
                <td className="p-4 md:table-cell block">
                  <div className="flex flex-col gap-3">
                    {/* Customer evidence */}
                    <div>
                      <div className="text-xs font-bold text-gray-500">
                        Customer
                      </div>

                      <div className="flex gap-2 overflow-x-auto mt-1">
                        {r.evidence?.customer?.map((img) => (
                          <img
                            key={img.id}
                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${img.image_path}`}
                            className="w-12 h-12 rounded object-cover border shrink-0"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Inspection evidence */}
                    <div>
                      <div className="text-xs font-bold text-gray-500">
                        Inspection
                      </div>

                      <div className="flex gap-2 overflow-x-auto mt-1">
                        {r.evidence?.inspection?.map((img) => (
                          <img
                            key={img.id}
                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${img.image_path}`}
                            className="w-12 h-12 rounded object-cover border shrink-0"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </td>

                {/* AMOUNT */}
                <td className="p-4 md:table-cell block font-bold text-gray-800">
                  ${r.refund_amount}
                </td>

                {/* STATUS */}
                <td className="p-4 md:table-cell block">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[r.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                {/* DATE */}
                <td className="p-4 md:table-cell block text-gray-500 text-sm">
                  {new Date(r.created_at).toLocaleString()}
                </td>

                {/* ACTION (PROMINENT ON MOBILE) */}
                <td className="p-4 md:table-cell block">
                  <Link
                    href={`/owner/refunds/${r.id}`}
                    className="flex items-center justify-center md:justify-start gap-1 text-xs px-3 py-2 border rounded-lg hover:bg-gray-100 w-full md:w-auto"
                  >
                    <Eye size={14} />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
