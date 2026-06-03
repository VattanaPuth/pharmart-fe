"use client";

import React from "react";
import Image from "next/image";

export default function PharmacyInspection({ inspectionData }) {
  //  If no inspection yet → don't render
  if (!inspectionData) return null;

  return (
    <div className="mt-4 max-w-4xl w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-8 font-sans">
      
      {/* HEADER */}
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
        {inspectionData.title || "Pharmacy Inspection"}
      </h3>

      {/* NOTE */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-indigo-500 mb-2">
          {inspectionData.noteLabel || "Inspector's Note"}
        </label>

        <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100/50">
          <p className="text-slate-700 leading-relaxed text-[15px]">
            {inspectionData.noteContent || "No notes provided"}
          </p>
        </div>
      </div>

      {/* IMAGE + DATE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        
        {/* IMAGE */}
        {inspectionData.imageSrc && (
          <div className="relative w-48 h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
            <Image
              src={inspectionData.imageSrc}
              alt="Inspection evidence"
              fill
              className="object-contain"
            />
          </div>
        )}

        {/* DATE */}
        <span className="text-xs font-medium text-slate-400 italic">
          {inspectionData.verifiedDate || ""}
        </span>
      </div>
    </div>
  );
}