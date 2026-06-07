"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import api from "@/lib/axios";
import { getStorageUrl } from "@/lib/media";
import toast from "react-hot-toast";
import { Star, Package, User, Calendar } from "lucide-react";
export default function OrderReviewPage() {
  const { orderId } = useParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/owner/reviews/${orderId}`);
      setOrder(res.data.data);
    } catch (err) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchReviews();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Review not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex flex-col justify-items-start">
                Reviews for 
                <label>
                  ID:   {order.id}
                </label>
                <label>
                  No# {order.order_number}
                </label>
              
              </h1>

              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {order.customer.name}
                </span>

                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {order.date}
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 text-center">
              <p className="text-xs font-bold text-yellow-600 uppercase">
                Average Rating
              </p>

              <div className="flex items-center justify-center gap-1 mt-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-black text-yellow-700">
                  {order.average_rating}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b bg-gray-50">
                <div className="flex items-center gap-4">
                  <Image
                    src={getStorageUrl(item.image, "/placeholder.png")}
                    alt={item.name}
                    width={72}
                    height={72}
                    className="rounded-xl border object-cover"
                    unoptimized
                  
                  />

                  <div>
                    <h2 className="font-bold text-gray-900">{item.name}</h2>

                    <p className="text-sm text-gray-500">{item.package_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={
                        star <= item.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-400 mb-1">
                    Customer Review
                  </p>

                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item.review || "No review message provided."}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t">
                  <span className="flex items-center gap-1">
                    <Package size={12} />
                    Qty: {item.quantity}
                  </span>

                  <span>Reviewed at: {item.reviewed_at || "N/A"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
