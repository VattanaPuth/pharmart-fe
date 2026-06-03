"use client";

import { User } from "lucide-react";
import api from "@/lib/axios";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const SkeletonInput = () => (
  <div className="w-full h-10.5 rounded-xl bg-gray-100 animate-pulse"></div>
);

const PersonalInfoSection = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    customer_name: "",
    phone_number: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  // cache
  const cacheRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ real cache
        if (cacheRef.current) {
          setForm(cacheRef.current);
          setLoading(false);
          return;
        }

        const res = await api.get(
          "/customer/information/getCustomerInformation",
        );

        if (res.data?.data) {
          setForm(res.data.data);

          // store in cache
          cacheRef.current = res.data.data;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(
        "/customer/information/updateCustomerInformation",
        form,
      );

      const updated = res.data.data;

      setForm(updated);

      // ✅ update cache too
      cacheRef.current = updated;

      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Your personal information has been updated.",
        confirmButtonColor: "#F06292",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update information. Please try again.",
        confirmButtonColor: "#F06292",
      });
    }
  };
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-2 mb-6 text-[#F06292]">
        <User size={20} />
        <h2 className="text-xl font-semibold text-slate-800">
          Personal Information
        </h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Full Name
            </label>
            {loading ? (
              <SkeletonInput />
            ) : (
              <input
                type="text"
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#F06292] focus:outline-none transition-all"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">
              Phone Number
            </label>
            {loading ? (
              <SkeletonInput />
            ) : (
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#F06292] focus:outline-none transition-all"
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">
            Email Address
          </label>
          {loading ? (
            <SkeletonInput />
          ) : (
            <input
              type="email"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
            />
          )}
        </div>

        <button className="bg-[#F06292] hover:bg-pink-600 text-white font-medium px-8 py-2.5 rounded-full transition-colors shadow-md shadow-pink-200">
          Save Changes
        </button>
      </form>
    </section>
  );
};

export default PersonalInfoSection;
