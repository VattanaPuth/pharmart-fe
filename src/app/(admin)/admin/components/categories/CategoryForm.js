"use client";

import { useState } from "react";
import { X, Pill, Heart, Baby, Activity, Star } from "lucide-react";
import toast from "react-hot-toast";

const icons = [
  { name: "pill", icon: Pill },
  { name: "heart", icon: Heart },
  { name: "baby", icon: Baby },
  { name: "activity", icon: Activity },
  { name: "star", icon: Star },
];

export default function AddCategoryForm({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("pill");

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      await onAdd({
        name,
        icon: selectedIcon,
        subCount: 0,
        status: "active",
      });

      toast.success("Category added successfully");

      setName("");
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  return (
    <div className="border border-pink-200 bg-white rounded-2xl p-6 mb-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800">New Main Category</h2>
        <button onClick={onClose}>
          <X size={18} className="text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      {/* Icon Selection */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Icon</p>
        <div className="flex gap-3">
          {icons.map((item) => {
            const Icon = item.icon;
            const active = selectedIcon === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setSelectedIcon(item.name)}
                className={`p-3 rounded-lg border transition ${
                  active
                    ? "bg-pink-100 border-pink-400 text-pink-500"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Name */}
      <div className="mb-6">
        <label className="text-sm text-gray-500 block mb-2">
          Category Name *
        </label>
        <input
          type="text"
          placeholder="e.g. Herbal Medicine"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-pink-400 text-white py-2 rounded-lg hover:bg-pink-500 transition"
        >
          Add Category
        </button>

        <button
          onClick={onClose}
          className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
