"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import api from "@/lib/axios";
import { getStorageUrl } from "@/lib/media";

const FALLBACK_IMAGE = "/no-image.png";


/* ---------------- Skeleton ---------------- */
const SkeletonCard = React.memo(() => (
  <div className="min-w-50 flex-1 bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
    <div className="aspect-square bg-slate-200" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="h-4 bg-slate-300 rounded w-1/3 mt-3" />
    </div>
  </div>
));

SkeletonCard.displayName = "SkeletonCard";

/* ---------------- Product Card ---------------- */
const ProductCard = React.memo(({ product }) => {
  const imageSrc = getStorageUrl(product?.image, FALLBACK_IMAGE);

  return (
    <div className="min-w-50 flex-1 bg-white rounded-2xl border border-slate-100 overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="aspect-square relative bg-white p-4 flex items-center justify-center group overflow-hidden">
        <Image
          src={imageSrc}
          alt={product?.name || "product"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain transition-transform duration-500 group-hover:scale-105"
          loading="eager"
        />
      </div>

      <div className="p-4 border-t border-slate-50">
        <h4 className="font-bold text-slate-800 text-sm truncate">
          {product?.name}
        </h4>
        <p className="text-xs text-slate-400 mt-1">
          {product?.pharmacy || "-"}
        </p>

        <div className="mt-3 text-pink-500 font-bold">
          ${Number(product?.price || 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

/* ---------------- Main Component ---------------- */
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 cache to avoid refetch on re-mount (simple in-memory)
  const cacheKey = "featured_products_cache";

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      // 🔥 check cache first
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setProducts(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const res = await api.get("/public/products/featured?limit=6");

      const result = res.data?.data ?? res.data ?? [];
      const safeData = Array.isArray(result) ? result : [];

      setProducts(safeData);

      // 💾 cache result
      sessionStorage.setItem(cacheKey, JSON.stringify(safeData));
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    (async () => {
      if (!ignore) await fetchProducts();
    })();

    return () => {
      ignore = true;
    };
  }, [fetchProducts]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Featured Products
          </h2>
          <p className="text-sm text-slate-500">
            Quality medicines from verified sources
          </p>
        </div>

        <button className="flex items-center gap-1 text-pink-500 font-semibold hover:gap-2 transition-all">
          See all <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar lg:grid lg:grid-cols-6 lg:overflow-visible min-h-75">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
