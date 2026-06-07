import Image from "next/image";
import { MapPin, Package, Navigation } from "lucide-react";
import Link from "next/link";
import { getStorageUrl } from "@/lib/media";

const fallback = "/placeholder.png";
export const PharmacyCard = ({ pharmacy }) => (
  
  <Link 
  href={`/stores/detail/${pharmacy.id}`}
   className="bg-white rounded-2xl border border-slate-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
    
    {/* IMAGE */}
    <div className="relative h-48 w-full overflow-hidden">
      <Image

          src={getStorageUrl(pharmacy.image, fallback)}

      
        alt={pharmacy.name}
        fill
        className="object-contain group-hover:scale-105 transition-transform duration-500"
        unoptimized
      />
    </div>

    {/* CONTENT */}
    <div className="p-5">
      
      {/* NAME */}
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {pharmacy.name}
      </h3>

      {/* ADDRESS */}
      <div className="flex items-start gap-2 text-slate-500 mb-4">
        <MapPin size={16} className="shrink-0 mt-0.5 text-slate-400" />
        <p className="text-sm leading-snug">
          {pharmacy.address}
        </p>
      </div>

      {/* SALES (IMPORTANT → BIGGER) */}
      <div className="mb-5">
        <span className="text-lg font-bold text-slate-800">
          {pharmacy.completed_sales}
        </span>
        <span className="text-sm text-slate-500 ml-1">
          sales completed
        </span>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">

        {/* PRODUCTS */}
        <div className="flex items-center gap-2 text-slate-600">
          <Package size={16} />
          <span className="text-sm font-medium">
            {pharmacy.productsCount}
          </span>
          <span className="text-sm text-slate-400">
            products
          </span>
        </div>

        {/* DISTANCE */}
        <div className="flex items-center gap-2 text-slate-600">
          <Navigation size={16} />
          <span className="text-sm font-medium">
            {pharmacy.distance || "—"}
          </span>
        </div>

      </div>
    </div>
  </Link>
);
