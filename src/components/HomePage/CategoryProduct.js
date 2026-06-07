"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { getStorageUrl } from "@/lib/media";


const FALLBACK_IMAGE = "/no-image.png";

const ProductImage = ({ product, index }) => {
  const imageSrc = getStorageUrl(product?.main_image, FALLBACK_IMAGE);

  return (
    <div className="aspect-square relative p-4 flex items-center justify-center bg-white">
      <Image
        src={imageSrc}
        alt={product?.product_name || "product"}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 300px"
      />
    </div>
  );
};

/* ---------------- Category Card ---------------- */
const CategoryCard = ({ category }) => {
  const products = category.products || [];

  return (
    <div className="flex flex-col bg-white rounded-3xl border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <h3 className="text-xl font-bold">{category.name}</h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 border-y">
        {[0, 1, 2, 3].map((i) => {
          const product = products[i];

          return product ? (
            <ProductImage key={product.id} product={product} />
          ) : (
            <div
              key={`empty-${category.id}-${i}`}
              className="aspect-square bg-slate-50"
            />
          );
        })}
      </div>

      {/* Footer */}
      <button className="w-full p-4 flex justify-between hover:bg-slate-50">
        <span className="text-pink-500 font-semibold text-sm">
          See all in {category.name}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function CategoryProduct() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ get categories
        const catRes = await api.get("/public/categories/read");
        const cats = catRes.data || [];

        // 2️⃣ fetch products in parallel (FAST FIX)
        const enriched = await Promise.all(
          cats.map(async (cat) => {
            try {
              const res = await api.get(
                `/public/products/read?category_id=${cat.id}&limit=4`,
              );

              return {
                ...cat,
                products: res.data?.data || [],
              };
            } catch {
              return { ...cat, products: [] };
            }
          }),
        );

        setCategories(enriched);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-80 bg-slate-100 animate-pulse rounded-3xl"
            />
          ))
        : categories.map((cat) => <CategoryCard key={cat.id} category={cat} />)}
    </div>
  );
}
