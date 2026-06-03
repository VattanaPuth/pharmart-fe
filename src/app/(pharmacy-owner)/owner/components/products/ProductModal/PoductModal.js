"use client";

import { useState, useEffect, useRef } from "react";
import { XCircle } from "lucide-react";
import api from "@/lib/axios";
import ProductBasicInfo from "./ProductBasicInfo";
import ProductCategorySection from "./ProductCategorySection";
import ProductImageUpload from "./ProductImageUpload";
import ProductDescription from "./ProductDescription";
import ProductPackages from "./ProductPackages";
// import ProductStorage from "./ProductStorage";

// ============================================
// CONSTANTS
// ============================================
const FORM_OPTIONS = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Cream",
  "Drops",
  "Inhaler",
  "Patch",
  "Suppository",
  "Powder",
];

// ============================================
// EMPTY PACKAGE
// ============================================
const emptyPackage = () => ({
  id: Date.now() + Math.random(),
  package_name: "Box",
  contains: "",
  price: 0,
  stock_quantity: 0,
  low_stock_threshold: 10,
  is_default: false,
});

// ============================================
// EMPTY FORM
// ============================================
const emptyForm = () => ({
  product_name: "",
  generic_name: "",
  strength: "",
  form: "",
  expiry_date: "",
  category_id: null,
  subcategory_id: "",
  main_image: null,
  imagePreview: "",
  description: "",
  storageTemp: "room",
  packages: [emptyPackage()],
});

// ============================================
// MODAL
// ============================================
export default function ProductModal({
  isOpen,
  mode = "add",
  product = null,
  onClose,
  onSave,
  categories = [],
}) {
  const [form, setForm] = useState(emptyForm());

  const fileInputRef = useRef(null);

  // ============================================
  // LOAD PRODUCT
  // ============================================
  useEffect(() => {
    if (!isOpen) return;

    // ADD MODE
    if (mode === "add" || !product) {
      setForm(emptyForm());

      return;
    }

    // EDIT MODE
    setForm({
      ...product,

      id: product.id,
      expiry_date: product.expiry_date?.split("T")[0] || "",

      imagePreview: product.main_image || "",

      main_image: null,
    });
  }, [isOpen, mode, product]);

  if (!isOpen) return null;

  // ============================================
  // HELPERS
  // ============================================
  const set = (key, value) =>
    setForm((f) => ({
      ...f,
      [key]: value,
    }));

  const handleImageDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer?.files?.[0] || e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    setForm((f) => ({
      ...f,

      main_image: file,

      imagePreview: preview,
    }));
  };

  // ============================================
  // PACKAGES
  // ============================================
  const addPackage = () =>
    setForm((f) => ({
      ...f,

      packages: [...f.packages, emptyPackage()],
    }));

  const updatePackage = (idx, key, val) =>
    setForm((f) => ({
      ...f,

      packages: f.packages.map((p, i) =>
        i === idx ? { ...p, [key]: val } : p,
      ),
    }));

  const removePackage = (idx) =>
    setForm((f) => ({
      ...f,

      packages: f.packages.filter((_, i) => i !== idx),
    }));

  const setDefaultPackage = async (index) => {
    const pkg = form.packages[index];

    try {
      await api.put(`/owner/packages/set-default/${form.id}/${pkg.id}`);

      // update UI after success
      setForm((f) => ({
        ...f,
        packages: f.packages.map((p, i) => ({
          ...p,
          is_default: i === index,
        })),
      }));
    } catch (error) {
      console.error("Failed to set default:", error);
    }
  };

  // ============================================
  // SAVE
  // ============================================
  const cleanValue = (v) => {
    if (v === "null" || v === "" || v === undefined) return null;
    return v;
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("product_name", form.product_name);
      formData.append("generic_name", form.generic_name);
      formData.append("strength", form.strength);
      formData.append("form", form.form);
      formData.append("expiry_date", form.expiry_date);

      const categoryId = cleanValue(form.category_id);
      const subcategoryId = cleanValue(form.subcategory_id);

      if (categoryId !== null) {
        formData.append("category_id", categoryId);
      }

      if (subcategoryId !== null) {
        formData.append("subcategory_id", subcategoryId);
      }

      formData.append("description", form.description);

      if (form.main_image instanceof File) {
        formData.append("main_image", form.main_image);
      }

      form.packages.forEach((pkg, i) => {
        formData.append(`packages[${i}][package_name]`, pkg.package_name);
        formData.append(`packages[${i}][contains]`, pkg.contains);
        formData.append(`packages[${i}][price]`, pkg.price);
        formData.append(`packages[${i}][stock_quantity]`, pkg.stock_quantity);
        formData.append(
          `packages[${i}][low_stock_threshold]`,
          pkg.low_stock_threshold,
        );
        formData.append(`packages[${i}][is_default]`, pkg.is_default ? 1 : 0);
      });

      // EDIT
      if (mode === "edit") {
        await api.post(
          `/owner/products/updateProduct/${product.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      // ADD
      else {
        await api.post("/owner/products/addProduct", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      onSave?.();

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  // ============================================
  // CATEGORY
  // ============================================
  const selectedCategory = categories.find((c) => c.id == form.category_id);

  const subcategories = selectedCategory?.subcategories || [];

  // ============================================
  // STORAGE INFO
  // ============================================

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* PANEL */}
      <div className="relative h-full w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-in">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === "edit" ? "Edit Product" : "Add Product"}
            </h2>

            <p className="text-xs text-slate-400 mt-0.5">
              {mode === "edit"
                ? `Editing: ${product?.product_name}`
                : "Fill in details to add product"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* PRODUCT NAME */}
          <ProductBasicInfo form={form} set={set} />

          {/* CATEGORY */}
          <ProductCategorySection
            categories={categories}
            form={form}
            set={set}
          />

          {/* IMAGE */}
          <ProductImageUpload
            fileInputRef={fileInputRef}
            form={form}
            handleImageDrop={handleImageDrop}
          />

          {/* DESCRIPTION */}
          <ProductDescription form={form} set={set} />

          {/* PACKAGES */}
          <ProductPackages
            mode={mode}
            form={form}
            addPackage={addPackage}
            updatePackage={updatePackage}
            removePackage={removePackage}
            setDefaultPackage={setDefaultPackage}
          />

          {/* STORAGE */}
          {/* <ProductStorage form={form} /> */}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-500"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold"
          >
            {mode === "edit" ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }

          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.25s cubic-bezier(0.32, 0.72, 0, 1) both;
        }
      `}</style>
    </div>
  );
}
