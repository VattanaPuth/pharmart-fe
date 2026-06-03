import React from "react";
import { ChevronRight } from "lucide-react";
import { RotateCw } from "lucide-react";

const RefundStatusCard = ({ orderStatus }) => {
  return (
    <>
      <div className="w-full bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon Container */}
          <div className="w-12 h-12 bg-[#FFF8F1] rounded-full flex items-center justify-center text-[#D46B08]">
            <RotateCw size={24} />
          </div>

          {/* Text Content */}
          <div>
            <h3 className="text-sm font-bold text-gray-800">Refund & Return</h3>
            <p className="text-sm text-gray-400 truncate max-w-50 md:max-w-md">
              {/* {refundData?.description || "descser"} */}
              descser
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {/* {refundData?.evidenceCount || "2"} evidence photos attached */}
              2 evidence photos attached
            </p>
          </div>
        </div>

        {/* Status and Action */}
        <div className="flex flex-col items-end gap-4">
          <span className="bg-[#FFF8F1] text-[#D46B08] px-3 py-1 rounded-full text-xs font-bold border border-[#FFEDE0]">
            {orderStatus}
          </span>

          <button className="flex items-center gap-1 text-pink-400 text-xs font-bold hover:underline transition-all">
            View full details <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

export default RefundStatusCard;
