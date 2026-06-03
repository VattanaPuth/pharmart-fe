import React from "react";
import { Check, Clock, Mail, Store ,ShieldCheckIcon} from "lucide-react";

const icons = {
  check: Check,
  clock: Clock,
  mail: Mail,
  store: Store,
};

export function PharmacyRegistrationSuccessStep() {
  return (
    <div className="min-h-screen bg-white flex items-start justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-[#FFFBEB] rounded-full flex items-center justify-center mx-auto">
            <ShieldCheckIcon className="text-[#D97706] w-10 h-10" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] mb-2">Application Submitted!</h1>
          <p className="text-slate-500 text-[13px] leading-relaxed max-w-75 mx-auto">
            Your eKYC documents have been submitted for admin review. This typically takes 1-3 business days.
          </p>
        </div>

        <div className="bg-[#FFFBEB]/50 border border-[#FEF3C7] rounded-2xl p-6 text-left space-y-4">
          <h4 className="text-[#92400E] font-bold text-sm">What's next?</h4>
          <ul className="space-y-3">
            <NextStep icon="check" text="Documents submitted for review" active />
            <NextStep icon="clock" text="We verify your identity and licenses (eKYC). After approval, you can start selling." />
            <NextStep icon="mail" text="You'll be notified by email and in-app notification" />
            <NextStep icon="store" text="Once approved, you can start listing products" />
          </ul>
        </div>
      </div>
    </div>
  );
}



function NextStep({ icon, text, active = false }) {
  const IconComponent = icons[icon];

  return (
    <li className="flex gap-4 relative pb-6 last:pb-0">
      {/* Connecting Line */}
      <div className="absolute left-2.75 top-6 bottom-0 w-0.5 bg-[#FEF3C7] last:hidden" />
      
      {/* Icon Circle */}
      <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
        active ? "bg-[#D97706] text-white" : "bg-white border-2 border-[#FEF3C7] text-[#D97706]"
      }`}>
        <IconComponent size={14} strokeWidth={active ? 3 : 2} />
      </div>

      {/* Label Text */}
      <span className={`text-[12px] font-medium leading-tight ${
        active ? "text-[#92400E]" : "text-[#B45309]"
      }`}>
        {text}
      </span>
    </li>
  );
}