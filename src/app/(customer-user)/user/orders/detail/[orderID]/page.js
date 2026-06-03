"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, FileText, RotateCcw } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import RefundDialog from "@/components/CustomerOrders/RefundRequest";
import ProgressStep from "@/components/OrderDetail/ProgressStep";
import FulfillmentDetail from "@/components/OrderDetail/FulfillmentDetail";
import OrderItems from "@/components/OrderDetail/OrderItems";
import CustomerReview from "@/components/OrderDetail/CustomerReview";
import RefundStatusCard from "@/components/OrderDetail/RefundStatusCard";
import toast from "react-hot-toast";
export default function OrderDetails() {
  const router = useRouter();
  const { orderID } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  // =========================
  // FETCH ORDER
  // =========================
  const fetchOrder = async () => {
    try {
      const res = await api.get(`/customer/order/read/${orderID}`);
      setOrder(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (orderID) {
      fetchOrder().finally(() => setLoading(false));
    }
  }, [orderID]);

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    const styles = {
      delivering: "bg-cyan-100 text-cyan-600",
      ready: "bg-purple-100 text-purple-600",
      confirmed: "bg-green-100 text-green-600",
      completed: "bg-emerald-100 text-emerald-600",
      pending: "bg-yellow-100 text-yellow-600",
      cancelled: "bg-red-100 text-red-600",
      declined: "bg-red-200 text-red-700",
    };

    return styles[status] || "bg-gray-100 text-gray-600";
  };

  // =========================
  // ACTIONS
  // =========================
  const cancelOrder = async () => {
    if (isCanceling) return;

    try {
      setIsCanceling(true);

      const promise = api.put(`/customer/order/cancel/${order.id}`);

      toast.promise(promise, {
        loading: "Cancelling order...",
        success: "Order cancelled",
        error: (err) =>
          err.response?.data?.message || "Order cancellation failed",
      });

      await promise;

      await fetchOrder();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCanceling(false);
    }
  };

  const completeOrder = async () => {
    try {
      await api.put(`/customer/order/received/${order.id}`);
      toast.success("Order received confirmed");
      await fetchOrder();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Marking Order as Recived Failed",
      );
    }
  };

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-5xl space-y-4 p-4 animate-pulse">
          <div className="h-6 bg-gray-200 w-40 rounded mr-auto" />
          <div className="h-40 bg-gray-200 rounded-xl" />
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="h-32 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) return <p className="p-6">Order not found</p>;

  const isCustomerCompleted = !!order?.customer_completed_at;
  const isPharmacyCompleted = !!order?.pharmacy_completed_at;

  const status = order.status?.toLowerCase();
  const isReviewed = order.items?.every((item) => item.rating !== null);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft size={16} /> Back
        </button>

        {/* HEADER */}
        <section className="bg-white rounded-2xl p-6 border">
          <div className="flex justify-between mb-6">
            <div>
              <h1 className="font-bold text-lg">{order.order_id}</h1>
              <p className="text-sm text-gray-400">{order.date}</p>
            </div>

            <span
              className={`
    inline-flex items-center gap-1.5
    px-3 py-1.5 rounded-full text-xs font-semibold
    ${getStatusStyle(status)}
  `}
            >
              <span className="w-2 h-2 rounded-full bg-current opacity-70" />
              {order.status}
            </span>
          </div>

          {/* NEW: use status history */}
          <ProgressStep
            orderFulfillmentType={order.fulfillment.type}
            orderStatus={status}
            statusHistory={order.status_history}
          />
        </section>

        {status === "declined" && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-2">
            <p className="font-semibold text-red-700">Order Declined</p>

            {order.decline_reason ? (
              <div className=" p-3 border ">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Decline Reason
                </p>

                <p className="text-sm text-red-600">{order.decline_reason}</p>
              </div>
            ) : (
              <p className="text-sm text-red-500">
                No decline reason provided.
              </p>
            )}
          </div>
        )}

        {/* PHARMACY */}
        <Link
          href={`/stores/detail/${order?.owner_id}`}
          className="bg-white rounded-2xl p-4 border flex items-center gap-3 
             transition-all duration-300 ease-in-out 
             hover:shadow-lg hover:-translate-y-1 active:scale-95"
        >
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Image
              src={
                order?.pharmacy_logo
                  ? order?.pharmacy_logo.startsWith("http") ||
                    order?.pharmacy_logo.includes("amazon")
                    ? order?.pharmacy_logo
                    : `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${order?.pharmacy_logo}`
                  : "/placeholder.png"
              }
              alt="logo"
              width={40}
              height={40}
              className="transition-transform duration-300 group-hover:scale-110"
              unoptimized
            />
          </div>
          <div>
            <h2 className="text-sm font-bold">{order.pharmacy}</h2>
            <p className="text-xs text-gray-400">Verified Pharmacy</p>
          </div>
        </Link>

        {/* FULFILLMENT */}
        <section className="bg-white rounded-2xl p-6 border">
          <FulfillmentDetail orderFulfillment={order.fulfillment} />
        </section>

        {/* ITEMS */}
        <section className="bg-white rounded-2xl p-6 border">
          <OrderItems
            orderItems={order.items}
            deliveryFee={order.delivery_fee}
            totalAmount={order.totalAmount}
            paymentMethod={order.payment_method}
            invoice={`INV-${order.id}`}
            paymentRef={`PAY-${order.id}`}
          />
        </section>

        {/* DECLINED */}
        {status === "cancelled" && (
          <div className="bg-red-50 p-4 rounded-xl text-red-600">
            Order cancelled
          </div>
        )}

        {/* ACTION BUTTONS */}
        <section className="space-y-3">
          {["pending", "confirmed"].includes(status) && (
            <button
              onClick={cancelOrder}
              disabled={isCanceling}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out
    ${
      isCanceling
        ? "bg-red-200 text-red-400 cursor-not-allowed"
        : "bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 active:bg-red-200"
    }`}
            >
              {isCanceling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}

          {(status === "delivering" || status === "ready") && (
            <button
              onClick={completeOrder}
              disabled={isCustomerCompleted}
              className={`w-full py-3 rounded-xl font-semibold transition
              ${
                isCustomerCompleted
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-50 text-green-600 hover:bg-green-100"
              }`}
            >
              {isCustomerCompleted ? "Already Received" : "Mark as Received"}
            </button>
          )}

          {isCustomerCompleted && (
            <div className="relative border-2 border-green-600 bg-green-50 text-green-700 p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(34,197,94,0.4)]">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 bg-green-600 rounded-full animate-pulse" />
                <div>
                  <p className="font-semibold text-sm">
                    Order Received Confirmed
                  </p>
                  <p className="text-xs text-green-600/80 mt-1">
                    You have confirmed receiving this order. No further action
                    is required.
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === "completed" &&
            order.payment_method === "Card Payment" && (
              <>
                {/* IF REFUND EXISTS */}
                {order.refund ? (
                  <div className="flex items-center justify-between gap-4">
                    {/* STATUS CARD */}
                    <div className="flex-1 border-2 border-blue-500 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(59,130,246,0.3)]">
                      <p className="text-xs font-semibold uppercase tracking-wide">
                        Refund Status
                      </p>
                      <p className="text-sm font-bold mt-1 capitalize">
                        {order.refund.status}
                      </p>
                    </div>

                    {/* ACTION BUTTON */}
                    <button
                      onClick={() =>
                        router.push(
                          `/user/orders/detail/${order.id}/refund/${order.refund.id}`,
                        )
                      }
                      className="px-5 py-3 bg-white border-2 border-blue-500 text-blue-600 font-semibold rounded-xl shadow-[4px_4px_0px_0px_rgba(59,130,246,0.25)] hover:-translate-y-px active:translate-y-0.5 transition"
                    >
                      View Refund
                    </button>
                  </div>
                ) : (
                  /*  NO REFUND YET */
                  <>
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      className="w-full py-3 bg-orange-50 text-orange-600 rounded-xl"
                    >
                      Request Refund
                    </button>

                    <RefundDialog
                      isOpen={isDialogOpen}
                      onOpenChange={setIsDialogOpen}
                      orderId={order.id}
                      price={order.total_amount}
                      items={order.items}
                    />
                  </>
                )}
              </>
            )}
        </section>

        {["completed"].includes(status) && (
          <CustomerReview
            reviewSummited={isReviewed}
            pharmacy={order.pharmacy}
            items={order.items}
            orderId={order.id}
            refetchOrder={fetchOrder}
          />
        )}
      </div>
    </div>
  );
}
