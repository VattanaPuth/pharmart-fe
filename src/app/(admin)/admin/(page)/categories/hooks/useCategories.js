"use client";

import { useEffect, useState } from "react";
import categoryService from "../../../services/categoryService";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  // =====================
  // LOAD
  // =====================
  const loadCategories = async () => {
    try {
      setLoading(true);

      const res = await categoryService.getAll();
      const data = res.data?.data ?? res.data;

      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // UPDATE
  // =====================
  const updateCategory = async (id, newData) => {
    try {
      await categoryService.update(id, newData);

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, ...newData } : cat
        )
      );
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // =====================
  // ADD
  // =====================
  const addCategory = async (newCategory) => {
    try {
      const res = await categoryService.create(newCategory);
      const saved = res.data?.data ?? res.data;

      if (!saved?.id) {
        console.error("Invalid category response:", saved);
        return;
      }

      setCategories((prev) => [saved, ...prev]);
    } catch (error) {
      console.error("Add failed:", error);
    }
  };

  return {
    categories,
    loading,
    updateCategory,
    addCategory,
  };
}