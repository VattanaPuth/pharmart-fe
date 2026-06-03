"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Star, MapPin, ArrowRight } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";



// 2. Sub-component: Pharmacy Card
const PharmacyCard = ({ pharmacy }) => (
  <div className="flex bg-white rounded-2xl border border-slate-100 overflow-hidden min-w-[320px] md:min-w-0 flex-1 hover:shadow-md transition-shadow duration-300">
    {/* Image */}
    <div className="relative w-32 h-32 shrink-0 overflow-hidden rounded-xl">
      <Image
        src={pharmacy.image || "/pharm1.jpg"}
        alt={pharmacy.pharmacy_name}
        fill
        className="object-cover"
      />
    </div>

    {/* Content */}
    <div className="p-4 flex flex-col justify-between grow">
      <div>
        <h4 className="font-bold text-slate-800 text-base">
          {pharmacy.pharmacy_name}
        </h4>

        <div className="flex items-center gap-1 text-slate-400 mt-1">
          <MapPin className="w-3 h-3" />
          <span className="text-xs truncate">
            {pharmacy.gps_location || "No address"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        {/* rating placeholder (you can add real later) */}
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          {/* <span className="text-sm font-bold text-slate-700">4.5</span> */}
          <span className="text-xs text-slate-400">
           <> ({pharmacy.total_sales}) </>
           <> Purchases</>
          </span>
        </div>

        {/* distance from backend */}
        <span className="text-xs text-slate-400 font-medium">
          {pharmacy.distance ? `${pharmacy.distance} km` : "N/A"}
        </span>
      </div>
    </div>
  </div>
);

const PharmacyCardSkeleton = () => (
  <div className="flex bg-white rounded-2xl border border-slate-100 overflow-hidden min-w-[320px] md:min-w-0 flex-1 animate-pulse">
    {/* image */}
    <div className="w-32 h-32 bg-slate-200 rounded-xl shrink-0" />

    {/* content */}
    <div className="p-4 flex flex-col justify-between grow">
      <div>
        <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
        <div className="h-3 w-24 bg-slate-100 rounded" />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="h-3 w-20 bg-slate-200 rounded" />
        <div className="h-3 w-12 bg-slate-100 rounded" />
      </div>
    </div>
  </div>
);

export default function TopPharmacies() {
  const { user, role, address } = useAuth();

  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  const get_address_id = role == "CUSTOMER"? address?.id: null



  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        setLoading(true);

        // you can pass address_id if needed
        console.log(user)
        const res = await api.get("/public/pharmacies/top", {
          params: {
            
            address_id: get_address_id

            // address_id: 2
          },
        });

        setPharmacies(res.data.data || []);
        console.log(pharmacies)
      } catch (err) {
        console.error("Failed to load pharmacies", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, [user]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Popular Pharmacies Near You
          </h2>
          <p className="text-sm text-slate-400">Based on your location</p>
        </div>

        <button className="text-pink-500 text-sm font-semibold flex items-center gap-1">
          See all nearby<ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 md:grid md:grid-cols-3 md:overflow-visible">
          {[1, 2, 3].map((i) => (
            <PharmacyCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 md:grid md:grid-cols-3 md:overflow-visible">
          {pharmacies.map((shop) => (
            <PharmacyCard key={shop.id} pharmacy={shop} />
          ))}
        </div>
      )}

      {/* Data */}
      {/* <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 md:grid md:grid-cols-3 md:overflow-visible">
        {pharmacies.map((shop) => (
          <PharmacyCard key={shop.id} pharmacy={shop} />
        ))}
      </div> */}
    </section>
  );
}
