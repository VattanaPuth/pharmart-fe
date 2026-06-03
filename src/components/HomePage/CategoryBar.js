"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Pill,
  Leaf,
  Sparkles,
  Baby,
  Activity,
  TrendingUp,
  LayoutGrid,
} from "lucide-react";
import api from "@/lib/axios";


/* ---------------- icon map (unchanged) ---------------- */
const iconMap = {
  Medicines: <Pill className="w-4 h-4" />,
  "Vitamins & Supplements": <Leaf className="w-4 h-4" />,
  "Personal Care": <Sparkles className="w-4 h-4" />,
  "Baby & Mother Care": <Baby className="w-4 h-4" />,
  "Medical Devices": <Activity className="w-4 h-4" />,
  "Health & Wellness": <TrendingUp className="w-4 h-4" />,
};

/* ---------------- Skeleton ---------------- */
const CategorySkeleton = React.memo(() => {
  return (
    <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border bg-slate-100 animate-pulse">
      <div className="w-4 h-4 bg-slate-300 rounded" />
      <div className="w-24 h-3 bg-slate-300 rounded" />
    </div>
  );
});

CategorySkeleton.displayName = "CategorySkeleton";

/* ---------------- Main Component ---------------- */
const CategoryBar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const cacheKey = "categories_cache";

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);

      // ⚡ cache first (instant UI on revisit)
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setCategories(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const res = await api.get("/public/categories/read");

      // ⚠️ safe parsing (handles different backend formats)
      const result = res.data?.data ?? res.data ?? [];
      const safe = Array.isArray(result) ? result : [];

      setCategories(safe);

      // 💾 cache
      sessionStorage.setItem(cacheKey, JSON.stringify(safe));
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    (async () => {
      if (!ignore) await fetchCategories();
    })();

    return () => {
      ignore = true;
    };
  }, [fetchCategories]);

  return (
    <div className="w-full bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-3 whitespace-nowrap">
          
          {/* ALL PRODUCTS (unchanged UI) */}
          <Link href="/products">
            <span className="flex items-center gap-2 px-5 py-2.5 rounded-full border bg-slate-50/50 hover:bg-white hover:border-pink-400 transition cursor-pointer">
              <LayoutGrid className="w-4 h-4" />
              <span className="text-sm">All Products</span>
            </span>
          </Link>

          {/* LOADING */}
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))
            : categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category_id=${category.id}`}
                >
                  <span className="flex items-center gap-2 px-5 py-2.5 rounded-full border bg-slate-50/50 hover:bg-white hover:border-pink-400 transition cursor-pointer">
                    {iconMap[category.name] || (
                      <Pill className="w-4 h-4" />
                    )}
                    <span className="text-sm">{category.name}</span>
                  </span>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
