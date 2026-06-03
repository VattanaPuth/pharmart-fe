"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Check,
  XCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

import PharmacyInspection from "@/components/RefundDetail/PharmacyInspection";

const RefundPage = () => {
  const { orderID, refund } = useParams();
  const router = useRouter();

  const [refundData, setRefundData] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH REFUND DATA
  // =========================
  const fetchRefund = async () => {
    try {
      const res = await api.get(`/refunds/read/${refund}`);
      setRefundData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (refund) fetchRefund();
  }, [refund]);

  if (loading) return <RefundSkeleton />;
  if (!refundData) return <RefundNotFound />;

  // =========================
  // STEP LOGIC
  // =========================
  const stepLabels = [
    "Requested",
    "Approved",
    "Returning",
    "Return Verified",
    "Refunded",
  ];

  const getSteps = (status) => {
    if (status === "Refund Rejected") {
      return stepLabels.map((label, index) => ({
        id: index + 1,
        label,
        status: index === 0 ? "rejected" : "upcoming",
      }));
    }

    const statusMap = {
      requested: 0,
      approved: 1,
      returning: 2,
      verified: 3,
      refunded: 4,
    };

    const currentIndex = statusMap[status?.toLowerCase()] ?? 0;

    return stepLabels.map((label, index) => {
      if (index < currentIndex)
        return { id: index + 1, label, status: "completed" };
      if (index === currentIndex)
        return { id: index + 1, label, status: "current" };
      return { id: index + 1, label, status: "upcoming" };
    });
  };

  const steps = getSteps(refundData.status);

  const evidencePhotos = refundData.images || [];
  const inspectionData = refundData.inspection || null;

  return (
    <div className="bg-gray-50 p-6 text-slate-700">
      {/* BACK */}
      <button
        onClick={() => router.push(`/orders/detail/${orderID}`)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-4"
      >
        <ArrowLeft size={16} />
        Back to Order
      </button>

      {/* HEADER */}
      <section>
        <div className="bg-white rounded-2xl border p-6 flex justify-between">
          <div className="flex gap-3">
            <RotateCcw className="text-orange-500" />

            <div>
              <h2 className="text-xl font-bold">Refund & Return</h2>
              <p className="text-sm text-gray-400">
                Order #{refundData.order_id}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="bg-blue-50 text-blue-500 px-3 py-1 rounded-full text-xs capitalize">
              {refundData.status}
            </span>
            <p className="text-xl font-bold text-pink-500">
              ${refundData.refund_amount}
            </p>
          </div>
        </div>
      </section>

      {/* PROGRESS */}
      <section className="mt-4 bg-white p-6 rounded-2xl">
        <h3 className="text-xs font-bold text-gray-400 mb-6">
          REFUND PROGRESS
        </h3>

        <div className="flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center
                  ${step.status === "completed" && "bg-green-500 text-white"}
                  ${step.status === "current" && "bg-pink-100 text-pink-500"}
                  ${step.status === "rejected" && "bg-red-100 text-red-600"}
                  ${step.status === "upcoming" && "bg-gray-100 text-gray-400"}
                `}
              >
                {step.status === "completed" ? <Check size={16} /> : step.id}
              </div>

              <span className="text-xs mt-2 text-center">{step.label}</span>
            </div>
          ))}
        </div>

        {refundData.status === "Refund Rejected" && (
          <p className="text-red-500 mt-4 flex items-center gap-2">
            <XCircle /> Refund rejected
          </p>
        )}
      </section>

      {/* CUSTOMER REQUEST */}
      <section className="mt-4 bg-white p-6 rounded-2xl">
        <h3 className="text-xs font-bold text-gray-400 mb-4">YOUR REQUEST</h3>

        {/* ITEMS */}
        <div className="space-y-3">
          {refundData.items?.map((item) => {
            const oi = item.order_item;

            return (
              <div
                key={item.id}
                className="flex justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex gap-3">
                  {/* IMAGE */}
                  <div className="w-14 h-14 relative rounded-lg overflow-hidden border">
                    <Image
                      src={
                        oi?.product_image
                          ? oi?.product_image.startsWith("http") ||
                            oi?.product_image.includes("amazon")
                            ? oi?.product_image
                            : `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${oi?.product_image}`
                          : "/placeholder.png"
                      }
                      fill
                      className="object-cover"
                      alt={oi?.product_name}
                      unoptimized
                    />
                  </div>

                  {/* INFO */}
                  <div>
                    <p className="text-sm font-medium">{oi?.product_name}</p>

                    <p className="text-xs text-gray-400">{oi?.package_name}</p>

                    <p className="text-xs text-gray-400">
                      Qty: {item.quantity} × ${item.unit_price}
                    </p>
                  </div>
                </div>

                {/* PRICE */}
                <div className="text-sm font-bold text-pink-500">
                  ${item.line_refund_amount}
                </div>
              </div>
            );
          })}
        </div>

        {/* REASON */}
        <div className="mt-4 text-orange-600 flex items-center gap-2">
          <AlertTriangle size={16} />
          {refundData.reason}
        </div>

        {/* NOTE */}
        <p className="text-sm text-gray-600 mt-2">{refundData.note}</p>

        {/* IMAGES */}
        <div className="flex gap-3 flex-wrap mt-4">
          {evidencePhotos.map((img) => (
            <div
              key={img.id}
              className="w-28 h-28 relative rounded-lg overflow-hidden border"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${img.image_path}`}
                fill
                className="object-cover"
                alt="evidence"
                unoptimized
              />
            </div>
          ))}
        </div>
      </section>

      {/* INSPECTION */}
      {inspectionData && (
        <section className="mt-4">
          <PharmacyInspection inspectionData={inspectionData} />
        </section>
      )}

      {/* REFUNDED */}
      {refundData.status?.toLowerCase() === "refunded" && (
        <section className="mt-4 bg-green-50 p-6 rounded-2xl">
          <div className="flex items-center gap-2 text-green-600 font-bold">
            <CheckCircle2 />
            Refund Completed
          </div>

          <p className="text-sm mt-2">
            Method: {refundData.payment?.payment_provider}
          </p>

          <p className="text-lg font-bold mt-2">${refundData.refund_amount}</p>
        </section>
      )}
    </div>
  );
};

export default RefundPage;

const RefundSkeleton = () => {
  return (
    <div className="p-6 animate-pulse space-y-4">
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-6 flex justify-between">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        </div>

        <div className="text-right space-y-2">
          <div className="h-5 w-20 bg-gray-200 rounded ml-auto" />
          <div className="h-6 w-16 bg-gray-300 rounded ml-auto" />
        </div>
      </div>

      {/* STEPS */}
      <div className="bg-white rounded-2xl p-6">
        <div className="h-3 w-40 bg-gray-200 rounded mb-6" />

        <div className="flex justify-between">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center flex-1 space-y-2"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="h-2 w-12 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* ITEMS */}
      <div className="bg-white rounded-2xl p-6 space-y-4">
        <div className="h-3 w-32 bg-gray-200 rounded" />

        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex justify-between p-3 bg-gray-50 rounded-xl"
          >
            <div className="flex gap-3">
              <div className="w-14 h-14 bg-gray-200 rounded-lg" />
              <div className="space-y-2">
                <div className="h-3 w-32 bg-gray-200 rounded" />
                <div className="h-2 w-24 bg-gray-100 rounded" />
                <div className="h-2 w-20 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="h-4 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* IMAGES */}
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-28 h-28 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  );
};

const RefundNotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md bg-white p-8 rounded-2xl border shadow-sm">
        <div className="flex justify-center mb-4 text-red-500">
          <AlertTriangle size={40} />
        </div>

        <h2 className="text-lg font-bold text-gray-800">Refund Not Found</h2>

        <p className="text-sm text-gray-500 mt-2">
          The refund request you’re looking for doesn’t exist or may have been
          removed.
        </p>

        <button
          onClick={() => router.push(`/orders/detail/${orderID}`)}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
        >
          <ArrowLeft size={16} />
          Back to Order
        </button>
      </div>
    </div>
  );
};
