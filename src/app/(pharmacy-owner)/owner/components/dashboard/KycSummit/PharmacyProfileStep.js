import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PharmacyProfileStep({ onNext, ownerId }) {
  const searchParams = useSearchParams();
  // const ownerId = searchParams.get("owner_id");

  const [form, setForm] = useState({
    owner_name: "",
    pharmacy_name: "",
    date_of_birth: "",
    full_address: "",
    city: "",
    phone_number: "",
    email: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
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
      }
    };

    if (ownerId) load();
  }, [ownerId]);

  const isValid =
    form.owner_name &&
    form.pharmacy_name &&
    form.date_of_birth &&
    form.full_address &&
    form.city &&
    form.phone_number &&
    form.email;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-pink-50 rounded-lg text-pink-500">
          <Store size={20} />
        </div>

        <div>
          <h3 className="font-bold text-lg">Pharmacy Profile</h3>
          <p className="text-sm text-slate-500">
            Basic information for eKYC verification
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="grid gap-5">
        {/* Owner Name */}
        <div>
          <label className="text-sm font-semibold">Owner Name *</label>
          <Input
            value={form.owner_name}
            onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        {/* Pharmacy Name */}
        <div>
          <label className="text-sm font-semibold">Pharmacy Name *</label>
          <Input
            value={form.pharmacy_name}
            onChange={(e) =>
              setForm({ ...form, pharmacy_name: e.target.value })
            }
            placeholder="Health Pharmacy"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="text-sm font-semibold">Date of Birth *</label>
          <Input
            type="date"
            value={form.date_of_birth}
            onChange={(e) =>
              setForm({ ...form, date_of_birth: e.target.value })
            }
          />
        </div>

        {/* Full Address */}
        <div>
          <label className="text-sm font-semibold">Full Address *</label>
          <textarea
            value={form.full_address}
            onChange={(e) => setForm({ ...form, full_address: e.target.value })}
            className="w-full p-3 border rounded-xl"
          />
        </div>

        {/* City + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">City *</label>
            <Input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Phone Number *</label>
            <Input
              value={form.phone_number}
              onChange={(e) =>
                setForm({ ...form, phone_number: e.target.value })
              }
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-semibold">Email *</label>
          <Input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      {/* FOOTER */}
      <Button
        disabled={!isValid}
        onClick={() => onNext(form)}
        className="w-full bg-pink-400 text-white"
      >
        Continue to Documents
      </Button>
    </div>
  );
}
