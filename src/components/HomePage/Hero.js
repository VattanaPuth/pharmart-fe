import React from "react";
import Image from "next/image";
import { ShieldCheck, ArrowRight, Store } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row">
      {/* Left Content Side */}
      <div className="w-full lg:w-1/2 flex items-center">
        <div className="px-10 lg:px-20 py-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-sm font-medium mb-6">
            <ShieldCheck size={16} />
            <span>Only verified & licensed pharmacies</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
            Your Trusted Online <br />
            <span className="text-pink-500">Pharmacy Marketplace</span>
          </h1>

          <p className="mt-6 text-lg text-slate-500 max-w-lg leading-relaxed">
            Medicines, vitamins & medical supplies from licensed pharmacies —
            fast, safe, and convenient.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={'/products'} className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all shadow-lg shadow-pink-200">
              Browse Medicines
              <ArrowRight size={20} />
            </Link>

            <Link href={'/stores'} className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-2xl font-semibold transition-all">
              <Store size={20} />
              Find Pharmacies
            </Link>
          </div>
        </div>
      </div>

      {/* Right Image Side */}
      <div className="w-full lg:w-1/2 relative min-h-100 lg:min-h-screen">
        <Image
          src="/heroImg2.jpg"
          alt="Pharmacist in laboratory"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-white via-transparent to-transparent hidden lg:block" />
      </div>
    </div>
  );
};

export default Hero;
