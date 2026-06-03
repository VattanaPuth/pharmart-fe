"use client";
import Image from "next/image";
import { Star, Package, MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/BrowsePharmacies/ProductCard";
import ReviewSection from "@/components/StoreDetail/StoreReviewSection";
import { useEffect, useState } from "react";
import api from "@/lib/axios"; // your axios instance
import { useParams } from "next/navigation";
import PharmacySkeleton from "@/components/StoreDetail/PharmacySkeleton";
import {
  ProductSkeleton,
  CategorySkeleton,
} from "@/components/StoreDetail/PharmacySkeleton";

const reviews = [
  {
    name: "Alex Thompson",
    rating: 5,
    comment: "Great service and quality products. Highly recommend!",
    date: "3/2/2024",
  },
  {
    name: "Alex Thompson",
    rating: 5,
    comment: "Excellent products and service. Will order again.",
    date: "2/21/2026",
  },
  {
    name: "Sarah Chen",
    rating: 5,
    comment:
      "Very professional staff and fast delivery. The packaging was also excellent.",
    date: "1/15/2026",
  },
  {
    name: "James Patel",
    rating: 4,
    comment:
      "Good range of products. Prices are fair and delivery was on time.",
    date: "1/20/2026",
  },
  {
    name: "Emily Watson",
    rating: 3,
    comment: "Product was good but delivery took a bit longer than expected.",
    date: "2/1/2026",
  },
  {
    name: "Michael Lee",
    rating: 5,
    comment:
      "Absolutely love this pharmacy. Always stocked with what I need. Highly recommended!",
    date: "2/10/2026",
  },
];

const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
const weekends = ["saturday", "sunday"];

const formatHours = (days) => {
  const openDays = days.filter((d) => d.is_open);

  if (openDays.length === 0) return "Closed";

  const firstDay = openDays[0];

  if (!firstDay.open_time || !firstDay.close_time) {
    return "Open";
  }

  return `${firstDay.open_time.slice(0, 5)} - ${firstDay.close_time.slice(
    0,
    5,
  )}`;
};

const getHoursForGroup = (workingHours, dayList) => {
  const days = (workingHours || []).filter((d) =>
    dayList.includes(d.day_of_week),
  );

  return formatHours(days);
};

const StoreDetailPage = () => {
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const { store } = useParams();

  const [pharmacy, setPharmacy] = useState(null);
  const [loadingPharmacy, setLoadingPharmacy] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null); // pagination info

  useEffect(() => {
    if (!store) return;

    const fetchPharmacy = async () => {
      try {
        setLoadingPharmacy(true);
        const res = await api.get(`/public/pharmacies/${store}`);
        setPharmacy(res.data.data);
      } catch (err) {
        console.error("Failed to load pharmacy", err);
      } finally {
        setLoadingPharmacy(false);
      }
    };

    fetchPharmacy();
  }, [store]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await api.get("/public/categories/read");
        console.log(res);
        setCategories(res.data); // adjust if structure different
      } catch (err) {
        console.error("Failed to load categories", err);
      }

      setLoadingCategories(false);
    };

    fetchCategories();
  }, []);

  const fetchProducts = async (customPage = page) => {
    if (!store) return;

    setLoadingProducts(true);

    try {
      const res = await api.get(`/public/products/by-owner/${store}`, {
        params: {
          q: search || undefined,
          category_id: category?.id || undefined,
          page: customPage,
        },
      });

      setProducts(res.data.data.data);
      setMeta(res.data.data);
      setPage(customPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };
  useEffect(() => {
    fetchProducts(1);
  }, [store, category?.id]);

  if (loadingPharmacy) {
    return (
      <main className="min-h-screen bg-[#F9FAFB] pb-20">
        <PharmacySkeleton />
      </main>
    );
  }

  if (!pharmacy) {
    return <div className="p-10 text-center">Pharmacy not found</div>;
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* Navigation Breadcrumb */}


      <section className="store-img-contact max-w-7xl mx-auto px-4 mt-12 mb-20">
        {loadingPharmacy ? (
          <PharmacySkeleton />
        ) : (
          <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm">
            {/* ================= HEADER ================= */}
            <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
              {/* LEFT: LOGO + NAME */}
              <div className="flex items-center gap-5">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border">
                  <Image
                    src={pharmacy.logo || "/pharm1.jpg"}
                    alt={pharmacy.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1E2939]">
                    {pharmacy.name}
                  </h2>

                  {/* ⭐ Rating */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-0.5">
                      {[...Array(pharmacy.average_rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < pharmacy.average_rating
                              ? "text-yellow-400 fill-current"
                              : "text-slate-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {pharmacy.average_rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT: STATS */}
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div>
                  <span className="font-semibold text-slate-700">
                    {pharmacy?.total_products ?? 0}
                  </span>{" "}
                  products
                </div>
                <div>
                  <span className="font-semibold text-slate-700">
                    {pharmacy?.total_sales ?? 0}
                  </span>{" "}
                  sales
                </div>
              </div>
            </div>

            {/* ================= CONTACT ================= */}
            <div className="px-6 py-4 border-t bg-slate-50/50 space-y-2 text-sm text-slate-600">
              {/* ADDRESS */}
              <div className="flex flex-wrap items-center gap-2">
                <MapPin size={14} className="text-slate-400" />

                <span>{pharmacy?.address || "Address not available"}</span>

                {pharmacy.distance_km && (
                  <span className="text-xs text-slate-400">
                    • {pharmacy.distance_km} km away
                  </span>
                )}

                {pharmacy?.gps_location ? (
                  <a
                    href={pharmacy.gps_location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-500 hover:underline ml-1 inline-flex items-center gap-1"
                  >
                    View Map <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-slate-400">No map available</span>
                )}
              </div>

              {/* PHONE */}
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-slate-400" />
                <span>{pharmacy?.phone || "Not provided"}</span>
              </div>

              {/* EMAIL */}
              {pharmacy.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <span>{pharmacy.email}</span>
                </div>
              )}
            </div>

            {/* ================= WORKING HOURS ================= */}
            <div className="px-6 py-4 border-t">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Working Hours
              </h3>

              <div className="space-y-2 text-xl text-slate-600">
                {/* WEEKDAYS */}
                <div className="flex justify-between">
                  <span className="font-medium">Mon - Fri</span>

                  <span
                    className={
                      getHoursForGroup(pharmacy?.working_hours, weekdays) ===
                      "Closed"
                        ? "text-red-400"
                        : ""
                    }
                  >
                    {getHoursForGroup(pharmacy?.working_hours, weekdays)}
                  </span>
                </div>

                {/* WEEKEND */}
                <div className="flex justify-between ">
                  <span className="font-medium">Sat - Sun</span>

                  <span
                    className={
                      getHoursForGroup(pharmacy?.working_hours, weekends) ===
                      "Closed"
                        ? "text-red-400"
                        : ""
                    }
                  >
                    {getHoursForGroup(pharmacy?.working_hours, weekends)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="search-and-dropdown">
        <div className="flex w-full max-w-6xl items-center gap-4 p-4 mx-auto">
          {/* Search Input Section */}
          <div className="relative flex-1 flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="h-12 w-full border-2 rounded-xl border-[#E5E7EB] bg-white px-6"
            />

            <Button
              onClick={() => fetchProducts(1)}
              className="h-12 px-6 rounded-xl bg-pink-500 text-white"
            >
              Find
            </Button>
          </div>

          {loadingCategories ? (
            <CategorySkeleton />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 w-45 justify-between rounded-xl border-gray-200 bg-white px-6 font-normal hover:bg-gray-50 focus:ring-1 focus:ring-gray-400"
                >
                  {category?.name || "All Categories"}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-45 rounded-xl">
                {/* ALL */}
                <DropdownMenuItem
                  onClick={() => {
                    setCategory(null);
                  }}
                >
                  All Categories
                </DropdownMenuItem>

                {/* DYNAMIC */}
                {categories?.map((cat) => (
                  <DropdownMenuItem
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat);
                    }}
                  >
                    {cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </section>

      <section className="px-4 py-4 max-w-7xl mx-auto">
        <h2 className="font-medium text-base text-[#364153] mb-5">
          <span className="font-semibold text-slate-700">
            {pharmacy.total_products}
          </span>{" "}
          products
        </h2>

        {loadingProducts ? (
          <ProductSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loadingProducts ? (
              <p className="col-span-full text-center">Loading...</p>
            ) : products.length === 0 ? (
              <p className="col-span-full text-center">No products found</p>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} store={store} />
              ))
            )}
          </div>
        )}
      </section>

      {meta && (
        <div className="flex justify-center mt-6 gap-2">
          <Button
            disabled={!meta.prev_page_url}
            onClick={() => fetchProducts(page - 1)}
          >
            Prev
          </Button>

          <span className="px-4 py-2 text-sm">
            Page {meta.current_page} / {meta.last_page}
          </span>

          <Button
            disabled={!meta.next_page_url}
            onClick={() => fetchProducts(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* <section>
        <ReviewSection reviews={reviews} />
      </section> */}
    </main>
  );
};

export default StoreDetailPage;
