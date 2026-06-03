import React from "react";
import { ArrowRight, AlertTriangle } from "lucide-react";

function MiniSpinner() {
  return (
    <div className="w-4 h-4 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin" />
  );
}

export default function Banner({loadingCount, pendingCount, onReviewClick }) {
  const isLoading = pendingCount == null;

  return (
    <div className="bg-[#FFF1F5] border border-[#F8BBD0] rounded-2xl p-5">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-start space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#FDE4EC] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-[#F06292]" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              <span className="inline-flex items-center gap-2">
                {loadingCount ? (
                  <>
                    <MiniSpinner />
                    <span>Loading</span>
                  </>
                ) : (
                  <>
                    <span>{pendingCount}</span>
                    <span>
                      Pharmacy Registration{pendingCount !== 1 ? "s" : ""} Awaiting Review
                    </span>
                  </>
                )}
              </span>
            </h3>

            <p className="text-gray-600 text-sm">
              Please review eKYC documents and approve or reject pending applications.
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={onReviewClick}
          className="bg-[#F06292] hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-2 shrink-0 ml-6"
        >
          <span>Review</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}