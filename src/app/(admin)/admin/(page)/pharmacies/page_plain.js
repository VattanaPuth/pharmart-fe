"use client";

import React, { useState, useEffect } from "react";
import PharmacyCard from "../../components/pharmacies/components/PharmacyCard_plain";
import ActionModal from "./model/ActionModal";
import { pharmacyService } from "../../services/pharmacyService";
import Swal from "sweetalert2";

export default function PharmaciesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [search, setSearch] = useState("");

  // ✅ pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    last: 1,
    total: 0,
  });

  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    suspended: 0,
  });

  const [modal, setModal] = useState({
    open: false,
    type: null,
    id: null,
    message: "",
  });

  useEffect(() => {
    loadPharmacies(1); // reset to page 1 when tab changes
  }, [activeTab]);

  const loadPharmacies = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const data = await pharmacyService.getPharmacies(
        activeTab,
        search,
        page
      );

      const statusCounts = await pharmacyService.getStatusCounts();

      setPharmacies(data.data);
      setCounts(statusCounts);

      setPagination({
        current: data.current_page,
        last: data.last_page,
        total: data.total,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load pharmacies.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.last) return;
    loadPharmacies(page);
  };

  const openModal = (id, type) => {
    setModal({
      open: true,
      id,
      type,
      message: "",
    });
  };

  const closeModal = () => {
    setModal({
      open: false,
      type: null,
      id: null,
      message: "",
    });
  };

const handleConfirm = async () => {
  const statusMap = {
    approve: "approved",
    reject: "rejected",
    suspend: "suspended",
  };

  const newStatus = statusMap[modal.type];

  if (!newStatus) return;

  try {
    await pharmacyService.updatePharmacyStatus(
      modal.id,
      newStatus,
      modal.message
    );

    closeModal();

    await Swal.fire({
      icon: "success",
      title: "Success",
      text: `Pharmacy has been ${modal.type}d successfully.`,
      confirmButtonColor: "#F06292",
    });

    loadPharmacies(pagination.current);
  } catch (err) {
    console.error(err);

    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while updating pharmacy status.",
      confirmButtonColor: "#F06292",
    });
  }
};

  const tabs = [
    { id: "all", label: "All", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "approved", label: "Approved", count: counts.approved },
    { id: "rejected", label: "Rejected", count: counts.rejected },
    { id: "suspended", label: "Suspended", count: counts.suspended },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Pharmacy Management
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Review eKYC submissions and manage pharmacy status
        </p>

        {/* SEARCH */}
        <div className="mb-4 flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pharmacy name..."
            className="w-full max-w-sm rounded-lg border px-3 py-2 text-sm"
          />

          <button
            onClick={() => loadPharmacies(1)}
            className="rounded-lg bg-pink-500 px-4 py-2 text-sm text-white"
          >
            Search
          </button>
        </div>

        {/* TABS */}
        <div className="mb-4 flex gap-3 text-sm overflow-x-auto whitespace-nowrap pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border shrink-0 ${
                activeTab === tab.id
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {tab.label}
              <span className="text-xs">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-6">
            {pharmacies.length === 0 ? (
              <div>No pharmacies found</div>
            ) : (
              pharmacies.map((pharmacy) => (
                <PharmacyCard
                  key={pharmacy.id}
                  pharmacy={pharmacy}
                  onApprove={() => openModal(pharmacy.id, "approve")}
                  onReject={() => openModal(pharmacy.id, "reject")}
                  onSuspend={() => openModal(pharmacy.id, "suspend")}
                  onPreviewDoc={(doc) => setPreviewDoc(doc)}
                />
              ))
            )}
          </div>
        )}

        {/* ✅ PAGINATION */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {pagination.current} of {pagination.last}
          </span>

          <button
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.last}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>

      {/* MODAL */}
      <ActionModal
        isOpen={modal.open}
        type={modal.type}
        message={modal.message}
        onMessageChange={(v) =>
          setModal((prev) => ({ ...prev, message: v }))
        }
        onClose={closeModal}
        onConfirm={handleConfirm}
      />

      {/* IMAGE PREVIEW */}
      {previewDoc && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white p-4 rounded-xl max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewDoc.file_url}
              className="max-h-[80vh] rounded-lg"
              alt="document"
            />

            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}