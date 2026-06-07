"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.error || err.response?.data?.message || fallback;

const clearAuthState = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("pending_token");
  document.cookie = "token=; path=/; max-age=0";
};

export default function CustomerOnboardingPage() {
  const [form, setForm] = useState({
    customer_name: "",
    phone_number: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/get_user_info");
        const data = res.data;

        setForm((current) => ({
          customer_name: data?.display_name || current.customer_name,
          phone_number: data?.phone || data?.user?.phone || current.phone_number,
          email: data?.email || current.email,
        }));
      } catch {
        toast.error("Please login again to continue onboarding.");
        clearAuthState();
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await api.put("/customer/information/updateCustomerInformation", form);

      toast.success("Profile completed. Please sign in again.");
      clearAuthState();
      window.location.href = "/login";
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to complete onboarding."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start p-4 font-sans">
      <div className="text-center mb-8">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Pharmart Logo"
            width={200}
            height={200}
            priority
            className="mb-2"
          />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mt-4">
          Complete Profile
        </h1>
        <p className="text-slate-500 text-sm">
          Add your customer information to finish registration
        </p>
      </div>

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Link
          href="/registration/role-selection"
          className="flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Link>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <Input
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                disabled={loading || saving}
                required
                className="h-12 rounded-xl pl-10 border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <Input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                disabled={loading || saving}
                required
                className="h-12 rounded-xl pl-10 border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <Input
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                disabled={loading || saving}
                className="h-12 rounded-xl pl-10 border-slate-200"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || saving}
            className="w-full h-12 bg-pink-300 hover:bg-pink-400 text-white font-semibold rounded-full"
          >
            {saving ? "Saving..." : "Complete Registration"}
          </Button>
        </form>
      </div>
    </div>
  );
}
