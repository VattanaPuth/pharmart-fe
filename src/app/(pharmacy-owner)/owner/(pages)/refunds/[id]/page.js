"use client";

import {
  ArrowLeft,
  User,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  ShieldCheck,
  Banknote,
  Image as ImageIcon,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import api from "@/lib/axios";

export default function RefundDetail() {
  const params = useParams();
  const refundId = params?.id;

  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadFiles, setUploadFiles] = useState([]);
const [inspectionNote, setInspectionNote] = useState("");
const [previewImage, setPreviewImage] = useState(null);
const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!refundId) return;

    const fetchRefund = async () => {
      try {
        const res = await api.get(`/owner/refunds/${refundId}`);
        setRefund(res.data.data);
      } catch {
        toast.error("Failed to load refund");
      } finally {
        setLoading(false);
      }
    };

    fetchRefund();
  }, [refundId]);

  const runAction = async (url, message) => {
    try {
      setLoading(true);
      await api.put(url);
      toast.success(message);

      const res = await api.get(`/owner/refunds/${refundId}`);
      setRefund(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };


  const handleUploadInspection = async () => {
  if (!uploadFiles.length) {
    toast.error("Please select images");
    return;
  }

  const formData = new FormData();

  uploadFiles.forEach((file) => {
    formData.append("images[]", file);
  });

  formData.append("note", inspectionNote);

  try {
    setUploading(true);

    await api.post(
      `/owner/refunds/${refund.id}/inspection/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Inspection uploaded");

    const res = await api.get(`/owner/refunds/${refund.id}`);
    setRefund(res.data.data);

    setUploadFiles([]);
    setInspectionNote("");
  } catch (err) {
    toast.error(err.response?.data?.message || "Upload failed");
  } finally {
    setUploading(false);
  }
};

  if (loading || !refund) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading refund...
      </div>
    );
  }

  const customer = refund.customer?.information;
  const items = refund.items || [];
  const evidence = refund.evidence || {};

  const statusColors = {
    requested: "bg-yellow-100 text-yellow-700",
    approved: "bg-blue-100 text-blue-700",
    returning: "bg-purple-100 text-purple-700",
    verified: "bg-cyan-100 text-cyan-700",
    refunded: "bg-green-100 text-green-700",
    canceled: "bg-red-100 text-red-700",
  };

  const s = refund.status;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <Link href="/owner/refunds" className="flex items-center gap-2 text-gray-500">
            <ArrowLeft size={18} />
            Back
          </Link>

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[s]}`}>
            {s?.toUpperCase()}
          </span>
        </div>

        {/* REFUND CARD */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {refund.refund_number}
              </h1>
              <p className="text-gray-500 mt-1">
                {refund.reason} • {refund.note}
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-400 text-sm">Amount</p>
              <p className="text-2xl font-bold text-pink-600">
                ${refund.refund_amount}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-2 mt-5">

            {s === "requested" && (
              <button
                onClick={() => runAction(`/owner/refunds/${refund.id}/review`, "Approved")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <CheckCircle2 size={16} /> Approve
              </button>
            )}

            {s === "approved" && (
              <button
                onClick={() => runAction(`/owner/refunds/${refund.id}/process`, "Returning")}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <RefreshCcw size={16} /> Process Return
              </button>
            )}

            {s === "returning" && (
              <button
                onClick={() => runAction(`/owner/refunds/${refund.id}/verify`, "Verified")}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <ShieldCheck size={16} /> Verify
              </button>
            )}

            {s === "verified" && (
              <button
                onClick={() => runAction(`/owner/refunds/${refund.id}/complete`, "Refunded")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Banknote size={16} /> Refund
              </button>
            )}

            {s !== "refunded" && s !== "canceled" && (
              <button
                onClick={() => runAction(`/owner/refunds/${refund.id}/cancel`, "Canceled")}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <XCircle size={16} /> Cancel
              </button>
            )}
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="bg-white p-6 rounded-2xl border">
          <h2 className="font-bold flex items-center gap-2 mb-3">
            <User size={18} /> Customer
          </h2>

          <p className="font-semibold">{customer?.customer_name}</p>
          <p className="text-sm text-gray-500">{customer?.phone_number}</p>
          <p className="text-sm text-gray-500">{customer?.email}</p>
        </div>

        {/* PRODUCTS */}
        <div className="bg-white p-6 rounded-2xl border">
          <h2 className="font-bold flex items-center gap-2 mb-4">
            <Package size={18} /> Products
          </h2>

          {items.map((item) => (
            <div key={item.id} className="flex gap-4 mb-4">
              <img
                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${item.product?.main_image}`}
                className="w-16 h-16 rounded-lg object-cover border"
              />

              <div>
                <p className="font-semibold">
                  {item.product?.product_name}
                </p>

                <p className="text-sm text-gray-500">
                  Qty {item.quantity} • ${item.unit_price}
                </p>

                <p className="text-xs text-gray-400">
                  {item.product?.owner_setting?.pharmacy_name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* EVIDENCE */}
{/* EVIDENCE */}
<div className="bg-white p-6 rounded-2xl border">
  <h2 className="font-bold flex items-center gap-2 mb-4">
    <ImageIcon size={18} /> Evidence
  </h2>

  {/* CUSTOMER */}
  <p className="text-sm font-semibold mb-2">Customer Uploads</p>
  <div className="flex gap-2 mb-6 flex-wrap">
    {evidence.customer?.map((img) => (
      <img
        key={img.id}
        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${img.image_path}`}
        onClick={() =>
          setPreviewImage(
            `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${img.image_path}`
          )
        }
        className="w-20 h-20 rounded-lg object-cover border cursor-pointer hover:scale-105 transition"
      />
    ))}
  </div>

  {/* INSPECTION */}
  <p className="text-sm font-semibold mb-2">Inspection Uploads</p>

  <div className="flex gap-2 flex-wrap mb-4">
    {evidence.inspection?.map((img) => (
      <img
        key={img.id}
        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${img.image_path}`}
        onClick={() =>
          setPreviewImage(
            `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${img.image_path}`
          )
        }
        className="w-20 h-20 rounded-lg object-cover border cursor-pointer hover:scale-105 transition"
      />
    ))}
  </div>

  {/* UPLOAD (ONLY RETURNING) */}
  {refund.status === "returning" && (
    <div className="mt-4 border-t pt-4 space-y-3">
      
      <textarea
        value={inspectionNote}
        onChange={(e) => setInspectionNote(e.target.value)}
        placeholder="Inspection note..."
        className="w-full border rounded-lg p-2 text-sm"
      />

      <input
        type="file"
        multiple
        onChange={(e) =>
          setUploadFiles(Array.from(e.target.files))
        }
      />

      <button
        onClick={handleUploadInspection}
        disabled={uploading}
        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
      >
        {uploading ? "Uploading..." : "Upload Inspection"}
      </button>
    </div>
  )}
</div>

        {/* ORDER */}
        <div className="bg-white p-6 rounded-2xl border">
          <h2 className="font-bold mb-2 flex items-center gap-2">
            <Truck size={18} /> Order
          </h2>

          <p>{refund.order?.order_number}</p>
          <p className="text-gray-500">
            Status: {refund.order?.status}
          </p>
        </div>

      </div>

{previewImage && (
  <div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    onClick={() => setPreviewImage(null)}
  >
    <img
      src={previewImage}
      className="max-w-[90%] max-h-[90%] rounded-xl"
    />
  </div>
)}

    </div>
  );
}