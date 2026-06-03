"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Swal from "sweetalert2";

import {
  Box,
  Archive,
  Calendar,
  AlertTriangle,
  FileText,
  ChevronRight,
} from "lucide-react";

import { useRouter } from "next/navigation";
import api from "@/lib/axios";

const RefundDialog = ({ isOpen, onOpenChange, orderId, price, items = [] }) => {
  const router = useRouter();

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // REFUND MODE
  // =========================
  const [refundType, setRefundType] = useState("partial");

  // selected items for partial refund
  const [selectedItems, setSelectedItems] = useState([]);

  const issues = [
    { id: "wrong", title: "Wrong Item", sub: "Different product received", icon: Box },
    { id: "damaged", title: "Damaged", sub: "Broken or damaged item", icon: Archive },
    { id: "expired", title: "Expired", sub: "Past expiry date", icon: Calendar },
    { id: "quality", title: "Quality Issue", sub: "Not as expected", icon: AlertTriangle },
    { id: "other", title: "Other", sub: "Other reason", icon: FileText },
  ];

  // =========================
  // IMAGE HANDLER
  // =========================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 3) {
      return Swal.fire({
  icon: "warning",
  title: "Limit reached",
  text: "Max 3 images allowed",
});
      return;
    }

    setImages([...images, ...files]);
  };

  // =========================
  // TOGGLE ITEM SELECTION
  // =========================
  const toggleItem = (item) => {
    const exists = selectedItems.find((i) => i.id === item.id);

    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
if (!selectedIssue) {
  return Swal.fire({
    icon: "warning",
    title: "Missing Issue",
    text: "Select issue",
  });
}

if (description.length < 15) {
  return Swal.fire({
    icon: "warning",
    title: "Too Short",
    text: "Min 15 chars",
  });
}

if (images.length === 0) {
  return Swal.fire({
    icon: "warning",
    title: "No Images",
    text: "Upload at least 1 image",
  });
}

    if (refundType === "partial" && selectedItems.length === 0) {
      // return alert("Select at least 1 item");
      return Swal.fire({
  icon: "warning",
  title: "No items selected",
  text: "Select at least 1 item",
});
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("order_id", orderId);
      formData.append("reason", selectedIssue);
      formData.append("note", description);
      formData.append("refund_type", refundType);

      // images
      images.forEach((img) => {
        formData.append("images", img);
      });

      // items (ONLY for partial)
      if (refundType === "partial") {
        selectedItems.forEach((item, index) => {
          formData.append(`items[${index}][order_item_id]`, item.order_item_id);
          formData.append(`items[${index}][quantity]`, item.quantity);
        });
      }

      const res = await api.post("/refunds/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const refundId = res.data.data.id;

      onOpenChange(false);

      router.push(`/user/orders/detail/${orderId}/refund/${refundId}`);
      router.refresh();
    } catch (err) {
      console.error(err);
     // alert(err?.response?.data?.message || "Failed to submit refund");
      toast.error("Failed to submit refund");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-0">

        {/* HEADER */}
        <div className="p-6 border-b bg-white">
          <DialogTitle className="text-lg font-bold">
            Refund Request
          </DialogTitle>
          <DialogDescription>
            Order #{orderId} · ${price}
          </DialogDescription>
        </div>

        <div className="p-6 space-y-5">

          {/* REFUND TYPE */}
          <div>
            <label className="font-bold text-sm mb-2 block">Refund Type</label>

            <div className="flex gap-2">
              <button
                onClick={() => setRefundType("full")}
                className={`flex-1 p-2 rounded-xl border ${
                  refundType === "full" ? "bg-orange-100 border-orange-300" : ""
                }`}
              >
                Refund All
              </button>

              <button
                onClick={() => setRefundType("partial")}
                className={`flex-1 p-2 rounded-xl border ${
                  refundType === "partial"
                    ? "bg-orange-100 border-orange-300"
                    : ""
                }`}
              >
                Select Items
              </button>
            </div>
          </div>

          {/* ITEMS (ONLY PARTIAL) */}
          {refundType === "partial" && (
            <div>
              <label className="font-bold text-sm mb-2 block">
                Select Items
              </label>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {items.map((item) => (
                  <div
                     key={item.order_item_id} 
                    className="flex justify-between items-center border p-2 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-xs text-gray-700">-{item.package_name}</p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      onChange={() => toggleItem(item)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ISSUE */}
          <div>
            <label className="font-bold text-sm">Issue</label>
            <div className="space-y-2 mt-2">
              {issues.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue.id)}
                  className={`w-full p-3 border rounded-xl text-left ${
                    selectedIssue === issue.id
                      ? "bg-orange-50 border-orange-300"
                      : ""
                  }`}
                >
                  <p className="font-bold text-sm">{issue.title}</p>
                  <p className="text-xs text-gray-400">{issue.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe issue..."
            className="w-full p-3 border rounded-xl"
          />

          {/* IMAGES */}
          <input type="file" multiple onChange={handleImageChange} />
          <p className="text-xs text-gray-400">{images.length}/3 images</p>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 border rounded-xl p-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-orange-400 text-white rounded-xl p-2"
          >
            {loading ? "Submitting..." : "Submit"}
            <ChevronRight className="inline ml-1" size={16} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RefundDialog;