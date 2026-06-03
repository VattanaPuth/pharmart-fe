"use client";

import {
  ArrowLeft,
  FileText,
  Truck,
  User,
  MapPin,
  Package,
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

import InvoiceModal from "../../../components/products/InvoiceModal";
import api from "@/lib/axios";
import Link from "next/link";
import OrderProgress from "../../../components/orders/OrderProgressSteps";

export default function OrderDetail() {
  const params = useParams();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [reason, setReason] = useState("");

  // =========================
  // FETCH ORDER
  // =========================
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/owner/orders/${orderId}`);
        setOrder(res.data.data);
      } catch (err) {
        toast.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  // =========================
  // DATA PARSING
  // =========================
  const { customer = {}, items = [], history = {}, status = "" } = order;
  const total = Number(order.amount || 0) + Number(order.delivery_fee || 0);

  const s = status.toLowerCase();
  const isPending = s === "pending";
  const isConfirmed = s === "confirmed";
  const isReady = s === "ready";
  const isDelivering = s === "delivering";
  const isCompleted = s === "completed";

  const isDeliveryType = order.fulfillment_method?.toLowerCase() === "delivery";
  const isPickupType = order.fulfillment_method?.toLowerCase() === "pickup";

  // Action Logic
  const canAccept = isPending;
  const canDecline = isPending;
  const canMarkReady = isConfirmed;
  const canStartDelivery = false;
  const canComplete =
    (isDelivering && isDeliveryType) ||
    (isReady && isPickupType) ||
    order.can_complete;

  // =========================
  // ACTIONS
  // =========================
  const runAction = async (url, successMsg, payload = null) => {
    try {
      setLoading(true);
      await api.put(url, payload);
      toast.success(successMsg);
      const res = await api.get(`/owner/orders/${orderId}`);
      setOrder(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("en-GB", {
          timeZone: "Asia/Phnom_Penh",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  const getStatusStyles = () => {
    switch (s) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "ready":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "delivering":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "completed":
        return "bg-green-50 text-green-700 border-green-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Link
            href={"/owner/orders"}
            className="group flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors w-fit"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-semibold text-sm uppercase tracking-wider">
              Back to Dashboard
            </span>
          </Link>

          <button
            onClick={() => setOpenInvoice(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all active:scale-95"
          >
            <FileText size={16} className="text-pink-500" />
            Download Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN CONTENT (Left) */}
          <div className="lg:col-span-2 space-y-6">
            {/* ORDER HEADER */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <div className="flex flex-col justify-items-start">
                      <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        ID: {order.order_id}
                      </h1>
                      <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        NO# {order.order_number}
                      </h1>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles()}`}
                    >
                      {status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> {formatDate(order.created_at) || "Just now"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} /> <b>Payment:</b> {order.payment_status}
                    </span>
                  </div>
                </div>

                {/* DYNAMIC ACTIONS */}
                <div className="flex flex-wrap gap-2">
                  {canAccept && (
                    <button
                      onClick={() =>
                        runAction(
                          `/owner/orders/${order.id}/confirm`,
                          "Order Accepted",
                        )
                      }
                      className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-pink-100 transition-all"
                    >
                      Accept
                    </button>
                  )}
                  {canDecline && (
                    <button
                      onClick={() => setShowDecline(true)}
                      className="px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-sm transition-all"
                    >
                      Decline
                    </button>
                  )}
                  {canMarkReady && (
                    <button
                      onClick={() =>
                        runAction(
                          `/owner/orders/${order.id}/ready`,
                          "Order Ready",
                        )
                      }
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all"
                    >
                      {isPickupType ? "Ready for Pickup" : "Out to Delivering"}
                    </button>
                  )}

                  {canComplete && (
                    <button
                      onClick={() =>
                        runAction(
                          `/owner/orders/${order.id}/complete`,
                          "Order Completed",
                        )
                      }
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 transition-all"
                    >
                      {isPickupType ? "Complete Pickup" : "Mark Delivered"}
                    </button>
                  )}
                </div>
              </div>

              {order.decline_reason && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg text-red-600">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-800 uppercase tracking-wider">
                      Decline Reason
                    </p>
                    <p className="text-sm text-red-600">
                      {order.decline_reason}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <OrderProgress history={order.history}/>

            {/* PRODUCT LIST */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Package size={18} className="text-pink-500" /> Items Summary
                </h2>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  {items.length} PCS
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="p-6 flex items-center justify-between hover:bg-gray-50/30 transition-colors"
                  >
                    <div className="flex gap-4">
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${item.image}`
                        }
                        className="h-16 w-16 rounded-xl object-cover border border-gray-100"
                        alt={item.name}
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          {item.package_name} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ${item.line_total}
                      </p>
                      <p className="text-xs text-gray-400">
                        ${item.unit_price}/unit
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#fcfcfd] p-6 border-t border-gray-50 space-y-3">
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>${order.amount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Delivery Fee</span>
                  <span>${order.delivery_fee}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-100">
                  <span className="font-bold text-gray-900">Grand Total</span>
                  <span className="text-2xl font-black text-pink-600">
                    ${total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR (Right) */}
          <div className="space-y-6">
            {/* CUSTOMER PROFILE */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                <User size={18} className="text-pink-500" /> Customer
                Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center font-bold">
                    {customer.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{customer.name}</p>
                    <p className="text-xs text-gray-500">ID: #{customer.id}</p>
                  </div>
                </div>
                <div className="pt-2 space-y-2 border-t border-gray-50">
                  <p className="text-sm text-gray-600 flex items-center gap-2 truncate">
                    <span className="w-4 h-4 text-gray-400">@</span>{" "}
                    {customer.email}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-4 h-4 text-gray-400">#</span>{" "}
                    {customer.phone || "No phone"}
                  </p>
                </div>
              </div>
            </div>

            {/* FULFILLMENT INFO */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                {isDeliveryType ? (
                  <Truck size={18} className="text-pink-500" />
                ) : (
                  <Package size={18} className="text-pink-500" />
                )}
                Fulfillment Details
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Method
                    </p>
                    <p className="text-sm text-gray-700 leading-snug">
                      {order.fulfillment_method}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-pink-50 rounded-lg text-pink-500">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Address
                    </p>
                    <p className="text-sm text-gray-700 leading-snug">
                      {order.delivery_address}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                    <CreditCard size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Payment
                    </p>
                    <p className="text-sm text-gray-700 capitalize font-medium">
                      {order.payment_method} — {order.payment_status}
                    </p>
                  </div>
                </div>

                {/* Method-specific badge */}
                <div
                  className={`mt-2 p-3 rounded-xl border flex items-center gap-3 ${isDeliveryType ? "bg-amber-50 border-amber-100" : "bg-green-50 border-green-100"}`}
                >
                  {isDeliveryType ? (
                    <Truck size={16} className="text-amber-600" />
                  ) : (
                    <Package size={16} className="text-green-600" />
                  )}
                  <p
                    className={`text-xs font-bold uppercase ${isDeliveryType ? "text-amber-700" : "text-green-700"}`}
                  >
                    Scheduled for {order.fulfillment_method}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InvoiceModal
        isOpen={openInvoice}
        onClose={() => setOpenInvoice(false)}
        order={order}
      />

      {/* DECLINE MODAL */}
      {showDecline && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Decline Order
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                Please state the reason for declining. This message will be sent
                to the customer.
              </p>
              <textarea
                className="w-full border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                rows="4"
                placeholder="e.g., Medicine currently out of stock..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setShowDecline(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!reason.trim()) return toast.error("Reason required");
                  await runAction(
                    `/owner/orders/${order.id}/decline`,
                    "Order declined",
                    { reason },
                  );
                  setReason("");
                  setShowDecline(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-red-100 transition-all"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
