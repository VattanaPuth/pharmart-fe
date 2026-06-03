"use client";

import React, { useState } from "react";
import useCategories from "./hooks/useCategories";

import AddCategoryForm from "../../components/categories/CategoryForm";
import CategoryItem from "../../components/categories/CategoryItem";
import { CategorySkeleton } from "../../components/categories/CategorySkeleton";

export default function CategoriesPage() {
  const { categories, loading, updateCategory, addCategory } =
    useCategories();

  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <main className="p-8">

        {/* ================= HEADER ================= */}
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Category Management
            </h1>

            <div className="w-10 h-1 bg-[#F06292] rounded mt-2"></div>

            <p className="text-sm text-gray-500 mt-2">
              {loading ? "Loading..." : `${categories.length} categories`}
            </p>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-[#F06292] text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            + Add Category
          </button>
        </div>

        {/* ================= ADD FORM ================= */}
        {showAdd && (
          <AddCategoryForm
            onAdd={async (data) => {
              await addCategory(data);
              setShowAdd(false);
            }}
            onClose={() => setShowAdd(false)}
          />
        )}

        {/* ================= LIST ================= */}
        <div className="space-y-3">

          {/* 🔥 SKELETON LOADING */}
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}

          {/* 🟡 EMPTY STATE */}
          {!loading && categories.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              No categories found
            </div>
          )}

          {/* ✅ DATA */}
          {!loading &&
            categories.map((cat) => (
              <CategoryItem
                key={cat.id}
                category={cat}
                onUpdate={updateCategory}
              />
            ))}
        </div>

      </main>
    </div>
  );
}