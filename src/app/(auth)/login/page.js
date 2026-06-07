"use client";
import React from "react";
import { Phone } from "lucide-react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";




const LoginPage = () => {
  const router = useRouter();
  const { refreshAuth } = useAuth();


  const handleGoogleLogin = async (id_token) => {
    // We use toast.promise to handle the UI state of the async operation
    toast.promise(
      (async () => {
        const res = await api.post("/auth/google/login", {
          id_token,
        });

        const data = res.data;

        if (!data || data.error) {
          throw new Error(data.error || "Authentication failed");
        }

        // Save Auth Credentials
        if (data.token) {
          localStorage.setItem("token", data.token);
          document.cookie = `token=${data.token}; path=/`;
          await refreshAuth();
        }

        // 1. Handling Redirection Logic
        if (data.user.role === "OWNER") {
          const ownerId = data.owner?.id;
          if (data.user.onboarding_completed == 0) {
            router.push(`/registration/onboarding/owner?owner_id=${ownerId}`);
          } else {
            router.push("/owner/dashboard");
          }
          return data;
        }

        if (data.requires_role_selection || !data.user?.role) {
          router.push(
            `/registration/role-selection?google=1&id_token=${id_token}`,
          );
          return data;
        }


        // 2. ROUTE BY ROLE (Default fallback)
        switch (data.user.role) {
          case "CUSTOMER":
            router.push("/user/account");
            router.refresh();
            break;
          default:
            router.push("/");
            router.refresh();
            break;
        }

        localStorage.setItem("role", data.user.role);

        return data; // This triggers the success message
      })(),
      {
        loading: "Verifying with Google...",
        success: <b>Welcome to Pharmart!</b>,
        error: (err) => (
          <b>{err.message || "Login failed. Please try again."}</b>
        ),
      },
    );
  };

  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start p-4 font-sans">
      {/* Logo & Header */}
      <div className="text-center mb-8">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo.svg" // Path to your logo in the public folder
            alt="Pharmart Logo"
            width={200} // Adjust width (in pixels) based on your original asset size
            height={200} // Adjust height (in pixels)
            priority // Optional: Use this to load the logo quickly
            className="mb-2 " // Optional: Add spacing
          />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mt-4">
          Sign in to Pharmart
        </h1>
        <p className="text-slate-500 text-sm">
          Your trusted pharmacy marketplace
        </p>
      </div>

      {/* Card Container */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-md">
        {/* Auth Buttons */}
        <div className="space-y-4">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative px-3 bg-white text-[10px] text-slate-400 uppercase tracking-widest">
              Continue with
            </span>
          </div>

          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleGoogleLogin(credentialResponse.credential);
            }}
            onError={() => {
              console.log("Login With Google Failed");
            }}
          />

          <div className="relative flex items-center justify-center py-2">
            <span className="text-[10px] text-slate-300 uppercase">or</span>
          </div>

          <Link
            href={"/login/otp"}
            className="w-full flex items-center justify-between py-3 px-4 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-slate-400" />
              <span>Sign in with Phone (OTP)</span>
            </div>
            <svg
              className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center mt-10 text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href={"/registration"}
            className="text-pink-500 font-semibold hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
