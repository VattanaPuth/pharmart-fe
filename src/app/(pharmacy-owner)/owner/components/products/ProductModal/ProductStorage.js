import { IceCreamIcon } from "lucide-react";
import React from "react";
import { FaTemperatureQuarter } from "react-icons/fa6";
import { RiTempColdFill } from "react-icons/ri";


const ProductStorage = ({form}) => {
  const STORAGE_TEMPS = [
    {
      key: "room",
      label: "Room Temp",
      sub: "below 25°C",
      icon: <FaTemperatureQuarter className="text-yellow-200" />,
    },
    {
      key: "refrigerate",
      label: "Refrigerate",
      sub: "2°C – 8°C",
      icon: <RiTempColdFill className="text-teal-200" />,
    },
    {
      key: "freeze",
      label: "Freeze",
      sub: "below -18°C",
      icon: <IceCreamIcon className="text-blue-500" />,
    },
  ];

  const storageTempInfo = STORAGE_TEMPS.find((t) => t.key === form.storageTemp);

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {STORAGE_TEMPS.map((t) => (
          <button
            key={t.key}
            onClick={() => set("storageTemp", t.key)}
            className={`p-3 rounded-xl border text-center ${
              form.storageTemp === t.key
                ? "border-pink-400 bg-pink-50"
                : "border-slate-200"
            }`}
          >
            <div>{t.icon}</div>

            <div className="text-xs font-semibold">{t.label}</div>

            <div className="text-[10px] text-slate-400">{t.sub}</div>
          </button>
        ))}
      </div>

      {storageTempInfo && (
        <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm">
          {storageTempInfo.icon} {storageTempInfo.label} ({storageTempInfo.sub})
        </div>
      )}
    </div>
  );
};

export default ProductStorage;
