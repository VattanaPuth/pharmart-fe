// src/app/(auth)/registration/role-selection/page.js
"use client";
import { useState } from "react";
import React from "react";
import { User2, Store } from "lucide-react";
import Image from "next/image";
import api from "@/lib/axios";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const RoleSelectionPageContent = () => {
  const [role, setRole] = useState("OWNER"); // 'customer' or 'owner'

  const router = useRouter();
  const searchParams = useSearchParams();

  const idToken = searchParams.get("id_token");
  const isGoogle = searchParams.get("google") === "1";

  const handleContinue = async () => {
    try {
      let res;

      if (isGoogle && !idToken) {
        //alert("Google session expired. Please login again.");
        toast.error("Google session expired. Please login again.");
        
        router.push("/login");
        return;
      }

      // GOOGLE FLOW
      if (isGoogle) {
        res = await api.post("/auth/google/role", {
          id_token: idToken,
          role: role.toUpperCase(),
        });
      }

      // OTP FLOW
      else {
        const pendingToken =
          typeof window !== "undefined"
            ? localStorage.getItem("pending_token")
            : null;

        if (!pendingToken) {
          //alert("Session expired. Please start again.");
          toast.error("Session expired. Please start again.");
          
          router.push("/registration");
          return;
        }

        res = await api.post("/auth/register/complete", {
          pending_token: pendingToken,
          role: role,
        });
      }

      const payload = res.data?.data ?? res.data;
      const ownerId = payload.owner?.id;

      //  SAVE TOKEN
      localStorage.setItem("token", payload.token);
      document.cookie = `token=${payload.token}; path=/`;
      localStorage.removeItem("pending_token");

      if (!payload.user?.onboarding_completed) {
        if (role === "OWNER" && !ownerId) {
          toast.error("Owner profile was not created. Please try again.");
          return;
        }

        const onboardingPath =
          role === "OWNER"
            ? `/registration/onboarding/owner?owner_id=${ownerId}`
            : "/registration/onboarding/customer";

        router.push(onboardingPath);
        return;
      }

      if (role === "OWNER") {
        if (!ownerId) {
          toast.error("Owner profile was not found. Please login again.");
          router.push("/login");
          return;
        }

        router.push(`/registration/onboarding/owner?owner_id=${ownerId}`);
      } else {
        router.push("/registration/onboarding/customer");
      }
    } catch (err) {
      
      const data = err?.response?.data;
      const message = data?.error || data?.message || "Something went wrong";

      if (message.includes("Session expired")) {
        localStorage.removeItem("pending_token");
        toast.error(message);
        router.push("/registration/otp");
        return;
      }

      // HANDLE ALREADY SELECTED ROLE
      // if (status === 422 && data?.error === "Role has already been selected") {
      //   const roleLower = role.toLowerCase();

      //   router.push(`/registration/onboarding/${roleLower}`);
      //   return;
      // }

     // alert(data?.message || "Something went wrong");
     toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start p-4 font-sans">
      {/* Logo & Header */}
      <div className="text-center mb-8">
        <div className="flex flex-col items-center  gap-2">
          <Image
            src="/logo.svg" // Path to your logo in the public folder
            alt="Pharmart Logo"
            width={200} // Adjust width (in pixels) based on your original asset size
            height={200} // Adjust height (in pixels)
            priority // Optional: Use this to load the logo quickly
            className="mb-2" // Optional: Add spacing
          />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mt-4">
          Create Account
        </h1>
        <p className="text-slate-500 text-sm">Join Pharmart today</p>
      </div>

      {/* Card Container */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setRole("CUSTOMER")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              role === "CUSTOMER"
                ? "border-pink-500 bg-pink-50 text-pink-600"
                : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
            }`}
          >
            <User2 size={24} className="mb-2" />
            <span className="font-semibold text-sm">Customer</span>
            <span className="text-[10px] opacity-70">Browse & buy</span>
          </button>

          <button
            onClick={() => setRole("OWNER")}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
              role === "OWNER"
                ? "border-pink-500 bg-pink-50 text-pink-600"
                : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
            }`}
          >
            <Store size={24} className="mb-2" />
            <span className="font-semibold text-sm">Pharmacy Owner</span>
            <span className="text-[10px] opacity-70">Sell medicines</span>
          </button>
        </div>

        {/* eKYC Info Box (Conditional) */}
        {role === "OWNER" && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-8 flex gap-3">
            <p className="text-[11px] text-blue-700 leading-relaxed">
              Pharmacy owners must complete eKYC verification before selling.
              You&apos;ll be guided through this after registration.
            </p>
          </div>
        )}

        {/* Auth Buttons */}
        <button
          onClick={handleContinue}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border  rounded-lg font-medium text-white bg-[#F06292] hover:bg-pink-300 transition-colors"
        >
          <span>Continue</span>
        </button>

        {/* Footer */}
        <p className="text-center mt-10 text-sm text-slate-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-pink-500 font-semibold hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RoleSelectionPageContent;
