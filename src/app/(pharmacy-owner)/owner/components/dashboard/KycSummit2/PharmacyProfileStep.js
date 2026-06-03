import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { Store, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PharmacyProfileStep({ onNext, ownerId }) {
  const [form, setForm] = useState({
    owner_name: "",
    pharmacy_name: "",
    date_of_birth: "",
    full_address: "",
    city: "",
    phone_number: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // =======================
  // LOAD EXISTING DATA
  // =======================
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/owners/${ownerId}/ekyc/getstep1`);

        if (res.data) {
          setForm({
            owner_name: res.data.owner_name || "",
            pharmacy_name: res.data.pharmacy_name || "",
            date_of_birth: res.data.date_of_birth
              ? res.data.date_of_birth.split("T")[0]
              : "",
            full_address: res.data.full_address || "",
            city: res.data.city || "",
            phone_number: res.data.phone_number || "",
            email: res.data.email || "",
          });
        }
      } catch (err) {
        console.log("No draft yet");
      } finally {
        setLoading(false);
      }
    };

    if (ownerId) {
      load();
    }
  }, [ownerId]);

  // =======================
  // VALIDATION
  // =======================
  const isValid =
    form.owner_name &&
    form.pharmacy_name &&
    form.date_of_birth &&
    form.full_address &&
    form.city &&
    form.phone_number &&
    form.email;

  // =======================
  // SUBMIT
  // =======================
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await onNext(form);
    } finally {
      setSubmitting(false);
    }
  };

  // =======================
  // LOADING SCREEN
  // =======================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-pink-500">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  // =======================
  // UI
  // =======================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-pink-50 rounded-xl text-pink-500">
          <Store size={20} />
        </div>

        <div>
          <h3 className="font-bold text-lg text-gray-800">
            Pharmacy Profile
          </h3>

          <p className="text-sm text-slate-500">
            Basic information for eKYC verification
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="grid gap-5">
        {/* Owner Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Owner Name *
          </label>

          <Input
            value={form.owner_name}
            onChange={(e) =>
              setForm({
                ...form,
                owner_name: e.target.value,
              })
            }
            placeholder="John Doe"
          />
        </div>

        {/* Pharmacy Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Pharmacy Name *
          </label>

          <Input
            value={form.pharmacy_name}
            onChange={(e) =>
              setForm({
                ...form,
                pharmacy_name: e.target.value,
              })
            }
            placeholder="Health Pharmacy"
          />
        </div>

        {/* DOB */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Date of Birth *
          </label>

          <Input
            type="date"
            value={form.date_of_birth}
            onChange={(e) =>
              setForm({
                ...form,
                date_of_birth: e.target.value,
              })
            }
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Full Address *
          </label>

          <textarea
            value={form.full_address}
            onChange={(e) =>
              setForm({
                ...form,
                full_address: e.target.value,
              })
            }
            placeholder="Street, district, city..."
            className="w-full min-h-30 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* City + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              City *
            </label>

            <Input
              value={form.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  city: e.target.value,
                })
              }
              placeholder="Phnom Penh"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Phone Number *
            </label>

            <Input
              value={form.phone_number}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone_number: e.target.value,
                })
              }
              placeholder="012345678"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Email *
          </label>

          <Input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            placeholder="example@gmail.com"
          />
        </div>
      </div>

      {/* FOOTER */}
      <Button
        disabled={!isValid || submitting}
        onClick={handleSubmit}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white"
      >
        {submitting ? (
          <>
            <Loader2 className="animate-spin mr-2" size={18} />
            Saving...
          </>
        ) : (
          "Continue to Documents"
        )}
      </Button>
    </div>
  );
}