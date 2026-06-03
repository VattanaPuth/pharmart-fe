"use client";
import React, { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Check } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

let cachedAddresses = null;

const DeliveryAddressesSection = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    label: "",
    recipient_name: "",
    phone_number: "",
    full_address: "",
    city: "",
    google_map_link: "",
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      if (cachedAddresses) {
        setAddresses(cachedAddresses);
        setLoading(false);
        return;
      }

      const res = await api.get(
        "/customer/delivery-address/getDeliveryAddress",
      );

      cachedAddresses = res.data.data || [];
      setAddresses(cachedAddresses);
    } catch (err) {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  // ✅ INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ OPEN ADD
  const openAdd = () => {
    setEditing(null);
    setForm({
      label: "",
      recipient_name: "",
      phone_number: "",
      full_address: "",
      city: "",
      google_map_link: "",
    });
    setOpen(true);
  };

  // ✅ OPEN EDIT
  const openEdit = (addr) => {
    setEditing(addr);
    setForm(addr);
    setOpen(true);
  };

  // ✅ SAVE (ADD / UPDATE)
  const handleSave = async () => {
    try {
      if (editing) {
        const res = await api.put(
          `/customer/delivery-address/updateDeliveryAddress/${editing.id}`,
          form,
        );

        const updated = res.data.data;

        // smart update
        setAddresses((list) =>
          list.map((a) => (a.id === editing.id ? updated : a)),
        );

        toast.success("Updated successfully");
      } else {
        const res = await api.post(
          "/customer/delivery-address/addDeliveryAddress",
          form,
        );

        const newAddr = res.data.data;

        setAddresses((list) => [newAddr, ...list]);
        toast.success("Added successfully");
      }

      setOpen(false);
    } catch (err) {
      toast.error("Save failed");
    }
  };

  // ✅ DELETE (optimistic)
  const handleDelete = async (id) => {
    const prev = addresses;
    setAddresses((list) => list.filter((a) => a.id !== id));

    try {
      await api.delete(
        `/customer/delivery-address/deleteDeliveryAddress/${id}`,
      );
      toast.success("Deleted");
    } catch (err) {
      setAddresses(prev);
      toast.error("Delete failed");
    }
  };

  // ✅ SET DEFAULT (UI only)
  const setDefault = async (id) => {
    try {
      await api.put(`/customer/delivery-address/setDefault/${id}`);

      const updated = addresses.map((addr) => ({
        ...addr,
        is_default: addr.id === id,
      }));

      // safer: no need to sort (backend should handle ordering)
      setAddresses(updated);

      toast.success("Default address updated");
    } catch (err) {
      toast.error("Failed to update default address");
    }
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-[#F06292]">
          <MapPin size={20} />
          <h2 className="text-xl font-semibold text-slate-800">
            Delivery Addresses
          </h2>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-1 bg-[#F06292] hover:bg-pink-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={16} /> Add Address
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {loading
          ? [1, 2].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border bg-gray-100 animate-pulse"
              />
            ))
          : addresses.map((addr, index) => (
              <div
                key={addr.id}
                className={`p-5 rounded-2xl ${
                  addr.is_default
                    ? "border-2 border-pink-200 bg-pink-50/30"
                    : "border border-gray-100 bg-gray-50/50"
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{addr.label}</span>

                      {addr.is_default == 1 && (
                        <span className="bg-[#F06292] text-white text-[10px] px-2 rounded-full">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-sm">{addr.phone_number}</p>
                    <p className="text-sm text-gray-500">
                      {addr.full_address}, {addr.city}
                    </p>
                  </div>

                  <div className="flex gap-3 text-gray-400">
                    <button onClick={() => setDefault(addr.id)}>
                      <Check
                        className={`hover:text-green-500 ${
                          addr.is_default ? "text-green-500" : ""
                        }`}
                      />
                    </button>

                    <button onClick={() => openEdit(addr)}>
                      <Pencil className="hover:text-[#F06292]" />
                    </button>

                    <button onClick={() => handleDelete(addr.id)}>
                      <Trash2 className="hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">
              {editing ? "Edit Address" : "Add Address"}
            </h3>

            {[
              "label",
              "recipient_name",
              "phone_number",
              "full_address",
              "city",
              "google_map_link",
            ].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
                placeholder={
                  field === "google_map_link"
                    ? "Google Map Link (optional)"
                    : field.replaceAll("_", " ")
                }
                className={`w-full px-4 py-2 rounded-xl border ${
                  field === "google_map_link" ? "border-dashed" : ""
                }`}
              />
            ))}

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button
                onClick={handleSave}
                className="bg-[#F06292] text-white px-4 py-2 rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DeliveryAddressesSection;
