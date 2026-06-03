"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PharmacyCard } from "@/components/BrowsePharmacies/PharmacyCard";
import { updateQueryParams } from "@/lib/helpers";
import PharmacySkeleton from "@/components/BrowsePharmacies/PharmacySkeleton";
import EmptyState from "@/components/BrowsePharmacies/EmptyState";

export default function PharmaciesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  // ---------------- READ FROM URL ----------------
  const sortValue = searchParams.get("sort") || "name_asc";
  const page = Number(searchParams.get("page") || 1);
  const searchInput = searchParams.get("q") || "";

  // UI label mapping
  const sortLabelMap = {
    name_asc: "Name A-Z",
    name_desc: "Name Z-A",
    popularity: "Popularity",
    nearest: "Nearest",
  };

  const sortBy = sortLabelMap[sortValue];
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
  });

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
        console.log("Location denied", err);
      },
    );
  }, []);

  // ---------------- FETCH ----------------
  const fetchPharmacies = async () => {
    try {
      setLoading(true);

      const res = await api.get("/public/pharmacies/read", {
        params: {
          q: searchInput,
          sort: sortValue,
          page: page,

          // GPS
          lat: location.lat,
          lng: location.lng,
        },
      });

      const paginated = res.data.data;

      setPagination({
        current_page: paginated.current_page,
        last_page: paginated.last_page,
      });

      const formatted = paginated.data.map((p) => ({
        id: p.id,
        name: p.pharmacy_name,
        address: `${p.address}, ${p.city}`,
        completed_sales: p.total_sales,
        productsCount: p.total_products,
        distance: p.distance ? `${p.distance} km` : null,
        image: p.logo || "/pharm1.jpg",
      }));

      setPharmacies(formatted);
    } catch (err) {
      console.error(err);
      setPharmacies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, [sortValue, page, searchInput, location]);

  // ---------------- HANDLE SORT ----------------
  const handleSort = (value) => {
    updateQueryParams(router, searchParams, {
      sort: value,
      page: 1, // reset page
    });
  };

  // ---------------- HANDLE PAGE ----------------
  const changePage = (newPage) => {
    updateQueryParams(router, searchParams, {
      page: newPage,
    });
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Pharmacies</h1>
        </div>

        {/* SORT */}
        <div className="flex gap-3 mb-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-4 bg-white border rounded-xl px-4 py-3 text-sm">
                Sort: {sortBy}
                <ChevronDown size={16} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleSort("name_asc")}>
                Name A-Z
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleSort("name_desc")}>
                Name Z-A
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleSort("popularity")}>
                Popularity
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleSort("nearest")}>
                Nearest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* GRID */}
        {loading ? (
          <PharmacySkeleton />
        ) : pharmacies.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pharmacies.map((pharmacy) => (
                <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-2 mt-10">
              {/* PREV */}
              <button
                disabled={page === 1}
                onClick={() => changePage(page - 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Prev
              </button>

              {/* PAGE NUMBERS */}
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                .slice(Math.max(0, page - 3), page + 2)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => changePage(p)}
                    className={`px-3 py-1 rounded-lg ${
                      p === page ? "bg-pink-500 text-white" : "border"
                    }`}
                  >
                    {p}
                  </button>
                ))}

              {/* NEXT */}
              <button
                disabled={page === pagination.last_page}
                onClick={() => changePage(page + 1)}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
