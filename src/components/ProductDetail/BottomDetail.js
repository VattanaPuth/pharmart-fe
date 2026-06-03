import { Thermometer } from "lucide-react";

export default function BottomDetail() {
  return (
    <section className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm max-w-7xl mx-auto mt-9">
      <h2 className="font-bold text-slate-800 mb-6">Storage & Handling</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-4 p-2">
          <Thermometer className="text-amber-500 bg-amber-50  rounded-xl" />
          <div>
            <p className="text-[10px] uppercase text-slate-400">Temperature</p>
            <p className="text-sm font-semibold">Store below 25°C</p>
          </div>
        </div>
      </div>
    </section>
  );
}


