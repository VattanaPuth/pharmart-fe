"use client";

import React, { useEffect, useState } from "react";
import {
  Pill,
  Leaf,
  Sparkles,
  Baby,
  Activity,
  HeartPulse,
} from "lucide-react";

import api from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { updateQueryParams } from "@/lib/helpers";
import CategoryDropdown from "@/components/BrowseProductPage/BrowseProductDropdownFilters";
import {
  SortDropdown,
  CategoriesPills,
} from "@/components/BrowseProductPage/BrowseProductDropdownFilters";
import ProductCard from "@/components/BrowseProductPage/ProductCard";
/* ---------------- SKELETON ---------------- */
const ProductSkeleton = () => (
  <div className="p-4 animate-pulse">
    <div className="aspect-square bg-slate-200 rounded-xl mb-3" />
    <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-slate-100 rounded w-1/2" />
  </div>
);

const BrowseProducts = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ---------------- URL STATE (single source of truth) ----------------
  const page = Number(searchParams.get("page") || 1);
  const activeTab = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "name_asc";
  const query = searchParams.get("q") || "";

  // ---------------- LOCAL STATE ----------------
  const [category, setCategory] = useState("All Categories");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [lastPage, setLastPage] = useState(1);

  const [location, setLocation] = useState({
  lat: null,
  lng: null,
});

  // ---------------- SORT CONFIG ----------------
  const sortOptions = [
    {
      label: "Name A-Z",
      value: "name_asc",
      sort_by: "product_name",
      sort_dir: "asc",
    },
    {
      label: "Name Z-A",
      value: "name_desc",
      sort_by: "product_name",
      sort_dir: "desc",
    },
    {
      label: "Price: Low to High",
      value: "price_asc",
      sort_by: "price",
      sort_dir: "asc",
    },
    {
      label: "Price: High to Low",
      value: "price_desc",
      sort_by: "price",
      sort_dir: "desc",
    },
    {
      label: "Nearest",
      value: "distance_asc",
      sort_by: "distance",
      sort_dir: "asc",
    },
  ];

  const sortMap = {
    name_asc: { sort_by: "product_name", sort_dir: "asc" },
    name_desc: { sort_by: "product_name", sort_dir: "desc" },
    price_asc: { sort_by: "price", sort_dir: "asc" },
    price_desc: { sort_by: "price", sort_dir: "desc" },
    distance_asc: { sort_by: "distance", sort_dir: "asc" },
  };

// ---------------- GET USER LOCATION ----------------
useEffect(() => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    (err) => {
      console.log("Location permission denied", err);
    }
  );
}, []);

  // ---------------- FETCH PRODUCTS ----------------
const fetchProducts = async (p, cat, s) => {
  try {
    setLoadingProducts(true);

    const { sort_by, sort_dir } =
      sortMap[s] ?? sortMap.name_asc;

    const res = await api.get("/public/products/read", {
      params: {
        page: p,
        per_page: 8,
        category_id: cat !== "all" ? cat : null,
        sort_by,
        sort_dir,
        q: query,

        // GPS
        lat: location.lat,
        lng: location.lng,
      },
    });

    setProducts(res.data?.data || []);
    setLastPage(res.data?.last_page || 1);
  } catch (err) {
    console.error("Failed to load products", err);
  } finally {
    setLoadingProducts(false);
  }
};

  // ---------------- EFFECT: FETCH PRODUCTS ----------------
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     fetchProducts(page, activeTab, sort);
  //   }, 150);

  //   return () => clearTimeout(timer);
  // }, [page, activeTab, sort, searchParams]);

    useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(page, activeTab, sort);
    }, 150);

    return () => clearTimeout(timer);
  }, [page, activeTab, sort, searchParams,location]);

  // ---------------- FETCH CATEGORIES ----------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await api.get("/public/categories/read");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // ---------------- ICON MAP ----------------
  const getIcon = (name) => {
    const n = name?.toLowerCase();
    if (n?.includes("med")) return <Pill size={14} />;
    if (n?.includes("vit")) return <Leaf size={14} />;
    if (n?.includes("baby")) return <Baby size={14} />;
    if (n?.includes("device")) return <Activity size={14} />;
    if (n?.includes("well")) return <HeartPulse size={14} />;
    return <Sparkles size={14} />;
  };

  // ---------------- HANDLERS ----------------
  const handleCategoryChange = (id) => {
    const currentSort = searchParams.get("sort") || "name_asc";

    updateQueryParams(router, searchParams, {
      page: 1,
      category: id,
      sort: currentSort,
    });
  };

  const handleSortChange = (value) => {
    const currentCategory = searchParams.get("category") || "all";

    updateQueryParams(router, searchParams, {
      page: 1,
      category: currentCategory,
      sort: value,
    });
  };

  const changePage = (newPage) => {
    updateQueryParams(router, searchParams, {
      page: newPage,
    });
  };

  // ---------------- CATEGORY LABEL (no extra state needed) ----------------
  const categoryLabel =
    activeTab === "all"
      ? "All Categories"
      : categories.find((c) => String(c.id) === String(activeTab))?.name ||
        "Categories";

  return (
    <main className="py-5 px-4 bg-[#F9FAFB]">
      {/* HEADER */}
      <section className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Browse Products
        </h1>
      </section>

      {/* CONTROLS */}

      <section className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex flex-wrap gap-3 w-full">
          {/* CATEGORY */}

          <CategoryDropdown
            activeTab={activeTab}
            categories={categories}
            handleCategoryChange={handleCategoryChange}
            loadingCategories={loadingCategories}
          />

          {/* SORT */}

          <SortDropdown
            sort={sort}
            sortOptions={sortOptions}
            handleSortChange={handleSortChange}
          />
        </div>
      </section>

      {/* CATEGORY PILL */}
      <CategoriesPills
        activeTab={activeTab}
        getIcon={getIcon}
        handleCategoryChange={handleCategoryChange}
        loadingCategories={loadingCategories}
        categories={categories}
      />

      {/* PRODUCTS */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loadingProducts
            ? Array(8)
                .fill(0)
                .map((_, i) => <ProductSkeleton key={i} />)
            : products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    name: p.product_name,
                    price: Number(p.price ?? 0),
                    packageName: p.package_name,
                    stock_quantity: Number(p.stock_quantity ?? 0),
                    image: p.main_image,
                    storeName: p.store_name,
                    distance: p.distance,
                    category: p.category_name,
                    defaultPackageId: p.packages?.find(pkg => pkg.is_default)?.id,
                    average_rating: p.average_rating,
                    review_count: p.review_count

                  }}
                />
              ))}
        </div>
      </section>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          disabled={page === 1}
          onClick={() => changePage(page - 1)}
          className="px-4 py-2 bg-white border rounded-lg disabled:opacity-40"
        >
          Prev
        </button>

        <div className="flex gap-1">
          {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => changePage(p)}
              className={`px-3 py-1 rounded-lg border ${
                page === p
                  ? "bg-pink-500 text-white"
                  : "bg-white text-slate-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          disabled={page === lastPage}
          onClick={() => changePage(page + 1)}
          className="px-4 py-2 bg-white border rounded-lg disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default BrowseProducts;
