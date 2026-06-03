"use client"
import Image from "next/image";
import { MapPin, ArrowRight, Store } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "@/lib/axios";




const TrendingSection = () => {
    const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get("/public/trending-products");

        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Failed to load trending products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);


  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT: Trending Products Grid */}
        <div className="grow bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="p-6 flex justify-between items-center border-b border-slate-50">
            <div className="flex items-center gap-2">
              {/* <Sparkles className="w-5 h-5 text-orange-400" /> */}
              <h2 className="text-xl font-bold text-slate-800">
                Trending This Week
              </h2>
            </div>
            <button className="text-pink-500 text-sm font-semibold hover:underline">
              See all →
            </button>
          </div>

          {/* Product Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {loading
    ? Array.from({ length: 6 }).map((_, i) => (
        <TrendingSkeleton key={i} />
      ))
    : products.map((product, idx) => (
        <div
          key={product.id}
          className={`p-6 flex flex-col group border-slate-50 
            ${idx % 3 !== 2 ? "lg:border-r" : ""} 
            ${idx < 3 ? "border-b" : ""}`}
        >
          <div className="aspect-square relative mb-4 transition-transform group-hover:scale-105 duration-300">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain"
            />
          </div>

          <h3 className="text-sm font-medium text-slate-700 mb-1">
            {product.name}
          </h3>

          <span className="text-pink-500 font-bold">
            ${Number(product.price).toFixed(2)}
          </span>

          <p className="text-xs text-slate-400">
            Sold: {product.total_sold}
          </p>
        </div>
      ))}
</div>
        </div>

        {/* RIGHT: Sidebar Column */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6">
          {/* Pharmacy Owner Card */}
          <div className="relative overflow-hidden rounded-3xl bg-pink-50 p-8 flex flex-col h-full min-h-100">
            {/* Background Overlay - Replace with your pharmacist image */}
            <div className="absolute inset-0 opacity-20 z-0">
              <Image
                src="/bg1.jpg"
                alt="bg"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="relative z-10">
              <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm mb-6">
                <Store className="w-6 h-6 text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 leading-tight">
                Are You a Pharmacy Owner?
              </h2>
              <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                Join PharmaMarket, complete eKYC verification, and reach
                thousands of customers.
              </p>
              <button className="bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors flex items-center gap-2 w-fit">
                Register Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Find Nearby Card */}
          <button className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
              <div className="bg-pink-50 p-3 rounded-2xl">
                <MapPin className="w-6 h-6 text-pink-400" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-slate-800">
                  Find Nearby Pharmacies
                </h4>
                <p className="text-xs text-slate-400">
                  Pharmacies close to your location
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};



const TrendingSkeleton = () => {
  return (
    <div className="p-6 flex flex-col animate-pulse">
      <div className="aspect-square bg-slate-200 rounded-xl mb-4" />

      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />

      <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />

      <div className="h-4 bg-slate-200 rounded w-1/3" />
    </div>
  );
};

export default TrendingSection;
