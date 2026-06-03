"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function CategoryItem({ category, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(category.name);

  // 👇 IMPORTANT: sync with backend
  const [enabled, setEnabled] = useState(category.active);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEnabled(category.active);
  }, [category.active]);

const handleToggle = async () => {
  const newValue = !enabled;

  setEnabled(newValue); // UI update first (optimistic)

  try {
    await onUpdate(category.id, { active: newValue });
    toast.success("Updated");
  } catch (err) {
    setEnabled(!newValue); // rollback if fail
    toast.error("Failed to update");
  }
};

  const handleSave = async () => {
    try {
      await onUpdate(category.id, { name });
      setIsEditing(false);
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleCancel = () => {
    setName(category.name);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-sm transition">

      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-[#FFF1F5] flex items-center justify-center">
            <span className="text-[#F06292] text-sm">
              {category.icon || "•"}
            </span>
          </div>

          <div>
            {isEditing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-pink-200 rounded-lg px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-pink-100"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-900">
                {category.name}
              </p>
            )}

            <p className="text-xs text-gray-500">Category</p>
          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* TOGGLE (DB CONNECTED) */}
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
              enabled ? "bg-[#F06292]" : "bg-gray-200"
            } ${loading ? "opacity-50" : ""}`}
          >
            <span
              className={`h-3.5 w-3.5 bg-white rounded-full shadow transform transition ${
                enabled ? "translate-x-4" : "translate-x-1"
              }`}
            />
          </button>

          {/* EDIT */}
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-[#F06292] text-white rounded-lg text-xs"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 border border-gray-200 text-gray-600 rounded-lg text-xs"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-gray-400"
            >
              <Pencil size={14} />
            </button>
          )}

        </div>

      </div>
    </div>
  );
}