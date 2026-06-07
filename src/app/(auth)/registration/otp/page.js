// src/app/(auth)/registration/otp/page.js
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming shadcn
import { Input } from "@/components/ui/input"; // Assuming shadcn
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.error || err.response?.data?.message || fallback;

export default function PhoneRegisterForm() {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const [phone, setPhone] = useState("");

  const isValidPhone = phone.replace(/\D/g, "").length >= 7;

  const inputRefs = useRef([]);
  const [pendingToken, setPendingToken] = useState(null);

  useEffect(() => {
    localStorage.removeItem("pending_token");
  }, []);

  // Handle OTP digit changes
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSendOtp = async () => {
    try {
      localStorage.removeItem("pending_token");
      setPendingToken(null);
      setOtp(new Array(6).fill(""));

      const res = await api.post("/auth/register/otp/send", {
        phone: `+855${phone.replace(/\D/g, "")}`,
      });

      setPendingToken(res.data.pending_token);

      //alert("OTP sent!");
      toast.success("OTP sent !")
    } catch (err) {
      localStorage.removeItem("pending_token");
      setPendingToken(null);
      //alert(err.response?.data?.error || "Failed to send OTP");
      toast.error(getErrorMessage(err, "Failed to send OTP !"))
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const code = otp.join("");

      await api.post("/auth/register/otp/verify", {
        pending_token: pendingToken,
        code,
      });

      // redirect to role page
      localStorage.setItem("pending_token", pendingToken);
      window.location.href = "/registration/role-selection";
    } catch (err) {
      if (getErrorMessage(err, "").includes("Session expired")) {
        localStorage.removeItem("pending_token");
        setPendingToken(null);
      }
     // alert(err.response?.data?.error || "Invalid OTP");
     toast.error(getErrorMessage(err, "Invalid OTP"))

    }
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
          Create Account
        </h1>
        <p className="text-slate-500 text-sm">Join Pharmart today</p>
      </div>

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        {/* Back Button */}
        <Link
          href="/registration"
          className="flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>

        <div className="space-y-4">
          {/* Mobile Number Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Mobile Number
            </label>

            <div className="flex gap-2">
              <div className="flex w-full">
                <div className="flex items-center px-3 h-12 border border-r-0 border-slate-200 bg-slate-50/50 text-slate-600 text-sm rounded-l-xl">
                  <Phone size={16} className="mr-2" />
                  +855
                </div>

                <Input
                  type="tel"
                  placeholder="12 345 6789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 h-12 rounded-xl rounded-l-none border-slate-200 bg-white focus:bg-white"
                  required
                />
              </div>
              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={!isValidPhone}
                className="h-12 border-pink-200 rounded-[14px] text-pink-400 hover:bg-pink-50 hover:text-pink-500 disabled:opacity-50"
              >
                Send OTP
              </Button>
            </div>
          </div>

          {/* Verification Code Field */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              Verification Code
            </label>
            <div className="flex justify-center gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  disabled={!pendingToken}
                  type="text"
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-10 h-10 text-center text-lg font-semibold border rounded-xl outline-none transition-all
                    ${data ? "border-pink-400 bg-pink-50" : "border-slate-200 bg-slate-50"}
                     focus:border-pink-400 focus:bg-pink-50 focus:ring-2 focus:ring-pink-200
                    `}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleVerifyOtp}
          disabled={!pendingToken || otp.join("").length !== 6}
          className="w-full h-12 bg-pink-300 hover:bg-pink-400 text-white font-semibold rounded-full"
        >
          Sign Up
        </Button>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href={"/login"}
            className="text-pink-400 font-medium hover:underline"
          >
            log in
          </Link>
        </p>
      </div>
    </div>
  );
}
