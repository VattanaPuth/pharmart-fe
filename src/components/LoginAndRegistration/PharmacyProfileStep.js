import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";

import Swal from "sweetalert2";

import { Store } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function PharmacyProfileStep({ form, setForm, onSaved }) {
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("owner_id");

  const [saving, setSaving] = useState(false);

  // ---------------- LOAD DRAFT ----------------
  useEffect(() => {
    const load = async () => {
      try {
        // ✅ SHOW LOADING
        Swal.fire({
          title: "Loading profile...",
          text: "Fetching saved data",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

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
        // ✅ CLOSE LOADING
        Swal.close();
      }
    };

    if (ownerId) load();
  }, [ownerId, setForm]);
  // ---------------- VALIDATION ----------------
  const isValid =
    form.owner_name &&
    form.pharmacy_name &&
    form.date_of_birth &&
    form.full_address &&
    form.city &&
    form.phone_number &&
    form.email;

  // ---------------- SAVE ----------------
  const handleSave = async () => {
    try {
      setSaving(true);

      await api.post(`/owners/${ownerId}/ekyc/step1`, form);

      if (onSaved) {
        await onSaved();
      }

      await Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Profile saved successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);

      await Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not save profile",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-pink-50 rounded-lg text-[#F06292]">
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
        <div>
          <label className="text-sm font-semibold">Owner Name *</label>
          <Input
            value={form.owner_name}
            onChange={(e) =>
              setForm({
                ...form,
                owner_name: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Pharmacy Name *</label>
          <Input
            value={form.pharmacy_name}
            onChange={(e) =>
              setForm({
                ...form,
                pharmacy_name: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Date of Birth *</label>
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

        <div>
          <label className="text-sm font-semibold">Full Address *</label>
          <textarea
            value={form.full_address}
            onChange={(e) =>
              setForm({
                ...form,
                full_address: e.target.value,
              })
            }
            className="w-full p-3 border rounded-xl"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">City *</label>
            <Input
              value={form.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  city: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Phone Number *</label>
            <Input
              value={form.phone_number}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone_number: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Email *</label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="pt-4">
        <Button
          onClick={handleSave}
          disabled={!isValid || saving}
          className="w-full bg-[#F06292] hover:bg-pink-600 text-white"
        >
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
