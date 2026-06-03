"use client";

import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiAlertTriangle,
  FiRefreshCw,
} from "react-icons/fi";

import api from "@/lib/axios";

import DeleteModal from "../../components/products/Deletemodal";
import ProductModal from "../../components/products/ProductModal/PoductModal";
import { Package } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductsPageContent() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const [modal, setModal] = useState({
    open: false,
    mode: "add",
    product: null,
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  // =========================================
  // FETCH CATEGORIES
  // =========================================
  const fetchCategories = async () => {
    try {
      const response = await api.get("/public/categories/read");

      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // =========================================
  // FETCH PRODUCTS
  // =========================================
  const fetchProducts = async (
    categoryId = selectedCategory,
    page = currentPage,
  ) => {
    try {
      setLoading(true);

      const params = {
        page,
      };

      if (categoryId !== "all") {
        params.category_id = categoryId;
      }

      const response = await api.get("/owner/products/read", {
        params,
      });

      setItems(response.data.data || []);

      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // =========================================
  // INITIAL LOAD
  // =========================================
  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================================
  // FILTER CHANGE
  // =========================================
  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory, currentPage]);

  const start = Math.max(1, pagination.currentPage - 2);

  const end = Math.min(pagination.lastPage, pagination.currentPage + 2);
  const pages = [];

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", page);

    router.push(`?${params.toString()}`);
  };

  // =========================================
  // DELETE
  // =========================================
  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/owner/products/deleteProduct/${deleteTargetId}`);

      setItems((prev) => prev.filter((item) => item.id !== deleteTargetId));

      setDeleteTargetId(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTargetId(null);
  };

  // =========================================
  // ADD PRODUCT
  // =========================================
  const handleAddClick = () => {
    setModal({
      open: true,
      mode: "add",
      product: null,
    });
  };

  // =========================================
  // EDIT PRODUCT
  // =========================================
  const handleEditClick = (product) => {
    setModal({
      open: true,
      mode: "edit",
      product,
    });
  };

  // =========================================
  // SAVE PRODUCT
  // =========================================
  const handleModalSave = async () => {
    await fetchProducts();

    setModal({
      open: false,
      mode: "add",
      product: null,
    });
  };

  // =========================================
  // CLOSE MODAL
  // =========================================
  const handleModalClose = () => {
    setModal({
      open: false,
      mode: "add",
      product: null,
    });
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;

    const expiry = new Date(expiryDate);
    const today = new Date();

    expiry.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) {
      return {
        label: "Expired",
        className: "bg-red-100 text-red-700",
      };
    }

    if (diffDays <= 30) {
      return {
        label: "Near Expiry",
        className: "bg-yellow-100 text-yellow-700",
      };
    }

    return null;
  };

  return (
    <div className="bg-gray-50 w-full min-h-screen">
      {/* DELETE MODAL */}
      {deleteTargetId !== null && (
        <DeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* PRODUCT MODAL */}
      <ProductModal
        key={modal.mode + (modal.product?.id || "new")}
        isOpen={modal.open}
        mode={modal.mode}
        product={modal.product}
        onClose={handleModalClose}
        onSave={handleModalSave}
        categories={categories}
      />

      <div className="px-8 py-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Products</h1>

            <p className="text-sm text-slate-400 mt-1">
              {items.length} active products
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* CATEGORY FILTER */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="all">All Categories</option>

              <option value="uncategorized">Uncategorized</option>

              {categories
                .filter((category) => category.active)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>

            <button
              onClick={() => fetchProducts()}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium px-3 py-2 rounded-full hover:bg-slate-50 transition disabled:opacity-50"
            >
              <FiRefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
            {/* ADD BUTTON */}
            <button
              onClick={handleAddClick}
              className="inline-flex items-center gap-2 bg-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm hover:bg-pink-600 transition"
            >
              <span className="text-lg leading-none">+</span>
              Add Product
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm py-20 text-center">
            <div className="text-slate-400 text-sm">Loading products...</div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              {/* DESKTOP HEADER */}
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-slate-100">
                  {[
                    "Product",
                    "Category",
                    "Price",
                    "Stock",
                    "Expiry",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {items.map((product, i) => {
                  const defaultPackage = product.packages?.find(
                    (p) => p.is_default,
                  );

                  const stock = Number(defaultPackage?.stock_quantity ?? 0);
                  const expiryStatus = getExpiryStatus(product.expiry_date);

                  const threshold = Number(
                    defaultPackage?.low_stock_threshold ?? 10,
                  );

                  const isLowStock = stock > 0 && stock <= threshold;

                  const packageStats = product.packages?.reduce(
                    (acc, pkg) => {
                      const stock = Number(pkg.stock_quantity ?? 0);
                      const threshold = Number(pkg.low_stock_threshold ?? 10);

                      if (stock <= 0) acc.outOfStock++;
                      else if (stock <= threshold) acc.lowStock++;

                      return acc;
                    },
                    { lowStock: 0, outOfStock: 0 },
                  );

                  const stockWarnings = [];

                  if (packageStats.outOfStock > 0) {
                    stockWarnings.push(
                      `${packageStats.outOfStock} out of stock package${packageStats.outOfStock > 1 ? "s" : ""}`,
                    );
                  }

                  if (packageStats.lowStock > 0) {
                    stockWarnings.push(
                      `${packageStats.lowStock} low stock package${packageStats.lowStock > 1 ? "s" : ""}`,
                    );
                  }
                  return (
                    <tr
                      key={product.id}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition ${
                        i === items.length - 1 ? "border-none" : ""
                      }`}
                    >
                      <td colSpan={6} className="p-4 md:p-0">
                        {/* MOBILE */}
                        <div className="md:hidden space-y-4">
                          {/* TOP */}
                          <div className="flex gap-3">
                            <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                              <img
                                src={
                                  product.main_image
                                    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${product.main_image}`
                                    : "/images/placeholder.png"
                                }
                                alt={product.product_name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-slate-800">
                                {product.product_name}
                              </div>

                              <div className="text-xs text-slate-400 line-clamp-2 mt-1">
                                {product.description || "No description"}
                              </div>
                            </div>
                          </div>

                          {/* DETAILS */}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-xs text-slate-400">
                                Category
                              </div>

                              <div className="text-slate-700">
                                {product.category?.active === 0 ||
                                !product.category
                                  ? "Uncategorized"
                                  : product.category?.name}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs text-slate-400">
                                Price
                              </div>

                              <div className="font-semibold text-slate-800">
                                ${product.price || 0}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs text-slate-400">
                                Stock
                              </div>

                              <div>
                                <div className="text-sm text-slate-700">
                                  {product.stock_quantity}
                                </div>

                                {stockWarnings.length > 0 && (
                                  <div className="mt-1 text-xs text-orange-600">
                                    <FiAlertTriangle className="inline mr-1" />

                                    {stockWarnings.join(" • ")}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs text-slate-400">
                                Expiry
                              </div>

                              <div className="text-slate-700">
                                {product.expiry_date
                                  ? new Date(
                                      product.expiry_date,
                                    ).toLocaleDateString()
                                  : "-"}
                              </div>
                            </div>
                          </div>

                          {/* ACTIONS */}
                          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                              onClick={() => handleEditClick(product)}
                              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-500"
                            >
                              <FiEdit2 size={14} />
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteClick(product.id)}
                              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-500"
                            >
                              <FiTrash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* DESKTOP */}
                        <div className="hidden md:grid md:grid-cols-6 items-center">
                          {/* PRODUCT */}
                          <div className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                <img
                                  src={
                                    product.main_image
                                      ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${product.main_image}`
                                      : "/images/placeholder.png"
                                  }
                                  alt={product.product_name}
                                  className="object-cover w-full h-full"
                                />
                              </div>

                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-slate-800">
                                  {product.product_name}
                                </div>

                                <div className="text-xs text-slate-400 truncate max-w-55">
                                  {product.description || "No description"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* CATEGORY */}
                          <div className="px-6 py-4 text-sm text-slate-600">
                            {product.category?.active === 0 || !product.category
                              ? "Uncategorized"
                              : product.category?.name}
                          </div>

                          {/* PRICE */}
                          <div className="px-6 py-4 text-sm font-semibold text-slate-800">
                            ${product.price || 0}
                          </div>

                          {/* STOCK */}
                          <div className="px-6 py-4">
                            {isLowStock ? (
                              <span className="inline-flex items-center gap-1.5 text-orange-500 text-sm font-medium">
                                <FiAlertTriangle size={14} />
                                {stock}
                              </span>
                            ) : (
                              <span className="text-sm text-slate-700">
                                {stock}
                              </span>
                            )}

                            {stockWarnings.length > 0 && (
                              <div className="mt-1 text-xs text-orange-600">
                                <FiAlertTriangle className="inline mr-1" />

                                {stockWarnings.join(" • ")}
                              </div>
                            )}
                          </div>

                          {/* EXPIRY */}
                          <div className="px-6 py-4 text-sm text-slate-500">
                            {product.expiry_date ? (
                              <div className="flex items-center gap-2">
                                <span>
                                  {new Date(
                                    product.expiry_date,
                                  ).toLocaleDateString()}
                                </span>

                                {expiryStatus && (
                                  <span
                                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${expiryStatus.className}`}
                                  >
                                    {expiryStatus.label}
                                  </span>
                                )}
                              </div>
                            ) : (
                              "-"
                            )}
                          </div>

                          {/* ACTIONS */}
                          <div className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleEditClick(product)}
                                className="text-slate-400 hover:text-blue-500"
                              >
                                <FiEdit2 size={16} />
                              </button>

                              <button
                                onClick={() => handleDeleteClick(product.id)}
                                className="text-slate-400 hover:text-red-500"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* EMPTY STATE */}
            {items.length === 0 && (
              <div className="text-center py-16 text-slate-400 flex flex-col justify-center items-center">
                <div className="text-4xl">
                  <Package className="text-yellow-600" />
                </div>

                <div className="text-sm font-medium">No products found</div>

                <div className="text-xs mt-1">Try changing category filter</div>
              </div>
            )}
          </div>
        )}
      </div>

      {pagination.lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 py-6">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            className="px-3 py-2 rounded-lg border disabled:opacity-50"
          >
            Previous
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded-lg border ${
                page === pagination.currentPage
                  ? "bg-pink-500 text-white"
                  : "bg-white"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={pagination.currentPage === pagination.lastPage}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            className="px-3 py-2 rounded-lg border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
