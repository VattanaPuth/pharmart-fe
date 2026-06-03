"use client";

import { ArrowLeft, Truck, FileText } from "lucide-react";
import { useState } from "react";
import InvoiceModal from "./InvoiceModal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  confirmOrder,
  readyOrder,
  completeOrder,
  declineOrder,
} from "../../services/orderService";

export default function OrderDetail({ order, onBack }) {
  const router = useRouter();

  const [openInvoice, setOpenInvoice] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const customer = order?.customer || {};
  const items = order?.items || [];
  const history = order?.history || {};

  // =========================
  // STATUS FLAGS (FIXED)
  // =========================
  const status = order?.status?.toLowerCase();

  const isPending = status === "pending";
  const isConfirmed = status === "confirmed";
  const isReady = status === "ready";
  const isDelivering = status === "delivering";

  const canAccept = isPending;
  const canDecline = isPending;
  const canProgress = isConfirmed;
  const canComplete = isReady || isDelivering || order?.can_complete;

  // =========================
  // ACTION HANDLERS
  // =========================

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await confirmOrder(order.id);
      toast.success("Order confirmed");
      router.refresh();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to confirm");
    } finally {
      setLoading(false);
    }
  };

  const handleReady = async () => {
    try {
      setLoading(true);
      await readyOrder(order.id);

      toast.success(
        order.fulfillment_method === "pickup"
          ? "Ready for pickup"
          : "Out for delivery"
      );

      router.refresh();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      await completeOrder(order.id);
      toast.success("Completion requested");
      router.refresh();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!reason.trim()) return toast.error("Reason required");

    try {
      setLoading(true);
      await declineOrder(order.id, reason);

      toast.success("Order declined");
      setShowDecline(false);
      setReason("");
      router.refresh();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <>
      <div className="min-h-screen bg-[#f7f7fb] p-6">

        {/* BACK */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </button>

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              {order.order_id}
            </h1>

            <p className="mt-2 text-gray-400">{order.date}</p>

            <p className="mt-2 text-sm text-gray-500">
              Pharmacy: {order.pharmacy}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-xl font-bold text-white">
              {customer.name?.charAt(0) || "U"}
            </div>

            <div className="text-right">
              <div className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-700">
                {order.status}
              </div>

              <button
                onClick={() => setOpenInvoice(true)}
                className="mt-3 flex items-center gap-2 text-sm text-pink-500 hover:text-pink-600"
              >
                <FileText size={14} />
                View Invoice
              </button>
            </div>
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="mb-6 rounded-2xl border bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold">Customer</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-400">Name</p>
              <p className="font-medium">{customer.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="font-medium">{customer.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="font-medium">{customer.phone || "-"}</p>
            </div>
          </div>
        </div>

        {/* FULFILLMENT */}
        <div className="mb-6 rounded-2xl border bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold">Fulfillment</h2>

          <div className="flex gap-4">
            <Truck className="mt-1 text-pink-500" />

            <div className="w-full">
              <h3 className="font-medium">{order.delivery}</h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <p>Pharmacy: {order.pharmacy}</p>
                <p>Fee: ${order.delivery_fee || 0}</p>
                <p>Payment: {order.payment_method}</p>
                <p>Status: {order.payment_status}</p>
              </div>

              <p className="mt-4">
                Address: {order.delivery_address}
              </p>
            </div>
          </div>
        </div>

        {/* ITEMS */}
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold">Items</h2>

          {items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b py-4"
            >
              <div className="flex gap-4">
                <img
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${item.image}`
                  }
                  className="h-16 w-16 rounded-lg object-cover"
                />

                <div>
                  <p className="font-medium">
                    {item.display_product_name || item.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p>${item.unit_price}</p>
                <p className="text-sm text-gray-400">
                  Total: ${item.line_total}
                </p>
              </div>
            </div>
          ))}

          {/* TOTAL */}
          <div className="mt-6 flex justify-between border-t pt-4">
            <h3 className="text-xl font-bold">Total</h3>
            <p className="text-xl font-bold text-pink-500">
              $
              {Number(order.amount || 0) +
                Number(order.delivery_fee || 0)}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex flex-wrap gap-3">

          {canAccept && (
            <button
              disabled={loading}
              onClick={handleConfirm}
              className="rounded bg-green-500 px-4 py-2 text-white"
            >
              Accept
            </button>
          )}

          {canDecline && (
            <button
              onClick={() => setShowDecline(true)}
              className="rounded bg-red-500 px-4 py-2 text-white"
            >
              Decline
            </button>
          )}

          {canProgress && (
            <button
              disabled={loading}
              onClick={handleReady}
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              {order.fulfillment_method === "pickup"
                ? "Mark Ready"
                : "Out for Delivery"}
            </button>
          )}

          {canComplete && (
            <button
              disabled={loading}
              onClick={handleComplete}
              className="rounded bg-purple-500 px-4 py-2 text-white"
            >
              Complete
            </button>
          )}
        </div>
      </div>

      {/* DECLINE MODAL */}
      {showDecline && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="w-96 rounded-xl bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold">
              Decline Order
            </h2>

            <textarea
              className="w-full rounded border p-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason..."
            />

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowDecline(false)}>
                Cancel
              </button>

              <button
                onClick={handleDecline}
                className="rounded bg-red-500 px-3 py-2 text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <InvoiceModal
        isOpen={openInvoice}
        onClose={() => setOpenInvoice(false)}
        order={order}
      />
    </>
  );
}