"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Star,
  Search,
  ChevronRight,
  User,
  Calendar,
} from "lucide-react";

import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // =========================
  // FETCH REVIEWS
  // =========================
  const fetchReviews = async () => {
    try {
      const res = await api.get("/owner/reviews");

      setReviews(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // =========================
  // FILTER
  // =========================
  const filteredReviews = reviews.filter((order) => {
    const keyword = search.toLowerCase();

    return (
      order.order_id?.toLowerCase().includes(keyword) ||
      order.customer?.name?.toLowerCase().includes(keyword)
    );
  });

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              Customer Reviews
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage and monitor customer feedback.
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search order or customer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200
                bg-white text-sm outline-none
                focus:ring-2 focus:ring-pink-500
              "
            />
          </div>
        </div>

        {/* EMPTY */}
        {filteredReviews.length === 0 && (
          <div className="bg-white border rounded-2xl p-10 text-center text-gray-400">
            No reviews found.
          </div>
        )}

        {/* LIST */}
        <div className="space-y-4">
          {filteredReviews.map((order) => (
            <Link
              key={order.id}
              href={`/owner/reviews/${order.id}`}
              className="
                block bg-white border rounded-2xl p-5 shadow-sm
                hover:shadow-lg transition-all hover:-translate-y-1
              "
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                {/* LEFT */}
                <div className="space-y-4 flex-1">

                  {/* ORDER INFO */}
                  <div>
                    <div className="text-lg font-black text-gray-900 flex flex-col justify-items-start">
                  
                      <label>
  ID: {order.order_id}
                      </label>
                      <label>
  No#: {order.order_number}
                      </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">

                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {order.customer?.name}
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {order.date}
                      </span>

                    </div>
                  </div>

                  {/* PRODUCT PREVIEW */}
                  <div className="flex flex-wrap gap-3">
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="
                          flex items-center gap-2
                          bg-gray-50 border rounded-xl px-3 py-2
                        "
                      >
                        <Image
                        src={item.image
                        ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${item.image}`
                        : "/images/placeholder.png"}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover border"
                          unoptimized
                        />

                        <div>
                          <p className="text-xs font-semibold text-gray-800 line-clamp-1">
                            {item.name}
                          </p>

                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star
                              size={12}
                              className="fill-yellow-400 text-yellow-400"
                            />

                            <span className="text-xs font-bold">
                              {item.rating || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end justify-between gap-4">

                  {/* AVG RATING */}
                  <div
                    className="
                      bg-yellow-50 border border-yellow-100
                      rounded-xl px-4 py-3 text-center min-w-30
                    "
                  >
                    <p className="text-xs font-bold uppercase text-yellow-600">
                      Avg Rating
                    </p>

                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      <span className="text-xl font-black text-yellow-700">
                        {order.average_rating}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-1 text-sm font-bold text-pink-600">
                    View Reviews
                    <ChevronRight size={16} />
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}