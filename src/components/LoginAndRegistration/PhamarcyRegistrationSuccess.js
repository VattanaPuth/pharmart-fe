"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Mail, Store, ShieldCheckIcon } from "lucide-react";

const icons = {
  check: Check,
  clock: Clock,
  mail: Mail,
  store: Store,
};

// (assuming you already have this component somewhere)
const NextStep = ({ icon, text }) => {
  const Icon = icons[icon];

  return (
    <li className="flex items-start gap-3 text-sm text-slate-600">
      <Icon className="w-4 h-4 mt-0.5 text-slate-500" />
      <span>{text}</span>
    </li>
  );
};

export function PharmacyRegistrationSuccessStep() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-start justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* ICON */}
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-[#FFFBEB] rounded-full flex items-center justify-center mx-auto">
            <ShieldCheckIcon className="text-[#F06292] w-10 h-10" />
          </div>
        </div>

        {/* TITLE */}
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] mb-2">
            Application Submitted!
          </h1>

          <p className="text-slate-500 text-[13px] leading-relaxed max-w-75 mx-auto">
            Your eKYC documents have been submitted for admin review. This
            typically takes 1-3 business days.
          </p>
        </div>

        {/* NEXT STEPS */}
        <div className="bg-[#FFFBEB]/50 border border-[#FEF3C7] rounded-2xl p-6 text-left space-y-4">
          <h4 className="text-[#F06292] font-bold text-sm">What's next?</h4>

          <ul className="space-y-3">
            <NextStep icon="check" text="Documents submitted for review" />
            <NextStep
              icon="clock"
              text="We verify your identity and licenses (eKYC). After approval, you can start selling."
            />
            <NextStep
              icon="mail"
              text="You'll be notified by email and in-app notification"
            />
            <NextStep
              icon="store"
              text="Once approved, you can start listing products"
            />
          </ul>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => router.push("/owner/dashboard")}
          className="
            w-full py-3 rounded-xl
            bg-[#F06292] text-white
            font-bold hover:bg-[#b45309]
            transition
          "
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}


