"use client";

import React, { useMemo, useState } from "react";
import { Star, Check } from "lucide-react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

const CustomerReview = ({
  reviewSummited,
  pharmacy,
  items,
  orderId,
  refetchOrder,
}) => {
  const [submitting, setSubmitting] = useState(false);

  // 1. Deduplicate products by product_id
  const uniqueItems = useMemo(() => {
    const map = {};

    items.forEach((item) => {
      if (!map[item.product_id]) {
        map[item.product_id] = {
          ...item,
          packages: [item.package_name],
        };
      } else {
        map[item.product_id].packages.push(item.package_name);
      }
    });

    return Object.values(map);
  }, [items]);

  //  2. Review state (per product only)
  const [reviews, setReviews] = useState(
    uniqueItems.map((item) => ({
      product_id: item.product_id,
      rating: 5,
      review: "",
    })),
  );

  // =========================
  // HANDLERS
  // =========================
  const handleRating = (index, value) => {
    const updated = [...reviews];
    updated[index].rating = value;
    setReviews(updated);
  };

  const handleReview = (index, value) => {
    const updated = [...reviews];
    updated[index].review = value;
    setReviews(updated);
  };

  const submitReview = async () => {
    try {
      setSubmitting(true);
      await api.post(`/customer/order/review/${orderId}`, {
        items: reviews,
      });

      await refetchOrder();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  //  VIEW: ALREADY REVIEWED
  // =========================
  if (reviewSummited) {
    return (
      <>
        <div className="flex items-center gap-2 mb-4">
          <Check className="text-green-600" />
          <h3 className="font-bold">Review Submitted</h3>
        </div>

        <section className="bg-white border rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Check className="text-green-600" />
            <h3 className="font-bold">Your Reviews</h3>
          </div>

          {uniqueItems.map((item, index) => (
            <div key={item.product_id} className="border-b pb-4">
              <p className="font-semibold">{item.name}</p>

              {/* 📦 Packages */}
              {item.packages.length > 1 && (
                <p className="text-xs text-gray-400">
                  Packages: {item.packages.join(", ")}
                </p>
              )}

              {/* ⭐ Stars */}
              <div className="flex gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={
                      (item.rating || 0) >= star
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              {/* 📝 Review */}
              <p className="text-sm text-gray-600">
                {item.review || "No comment"}
              </p>

              {/* 🕒 Date */}
              {item.reviewed_at && (
                <p className="text-xs text-gray-400 mt-1">
                  Reviewed at: {new Date(item.reviewed_at).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </section>
      </>
    );
  }

  // =========================
  //  VIEW: SUBMIT REVIEW
  // =========================
  return (
    <section className="bg-white border rounded-2xl p-6 space-y-6">
      <h3 className="font-bold text-lg">Rate Your Items</h3>

      {uniqueItems.map((item, index) => (
        <div key={item.product_id} className="border-b pb-4">
          <p className="font-semibold">{item.name}</p>

          {/* Packages */}
          {item.packages.length > 1 && (
            <p className="text-xs text-gray-400">
              Packages: {item.packages.join(", ")}
            </p>
          )}

          {/*  Stars */}
          <div className="flex gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => handleRating(index, star)}>
                <Star
                  className={
                    reviews[index].rating >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>

          {/*  Review input */}
          <textarea
            placeholder="Write review..."
            className="w-full p-2 border rounded"
            value={reviews[index].review}
            onChange={(e) => handleReview(index, e.target.value)}
          />
        </div>
      ))}

      <button
        onClick={submitReview}
        disabled={submitting}
        className={`w-full py-3 rounded-xl font-semibold transition
    ${
      submitting
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-pink-500 text-white hover:bg-pink-600"
    }`}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </section>
  );
};

export default CustomerReview;
