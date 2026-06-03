"use client";

import React, { useState, useEffect } from "react";
import PharmacyCard from "../../components/pharmacies/components/PharmacyCard_neo";
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
    loadPharmacies(1);
  }, [activeTab]);

  const loadPharmacies = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const data = await pharmacyService.getPharmacies(activeTab, search, page);

      const statusCounts = await pharmacyService.getStatusCounts();

      setPharmacies(data.data);
      setCounts(statusCounts);

      setPagination({
        current: data.current_page,
        last: data.last_page,
        total: data.total,
      });
    } catch (err) {
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
    setModal({ open: true, id, type, message: "" });
  };

  const closeModal = () => {
    setModal({ open: false, type: null, id: null, message: "" });
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
        modal.message,
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
    { id: "all", label: "ALL", count: counts.all },
    { id: "pending", label: "PENDING", count: counts.pending },
    { id: "approved", label: "APPROVED", count: counts.approved },
    { id: "rejected", label: "REJECTED", count: counts.rejected },
    { id: "suspended", label: "SUSPENDED", count: counts.suspended },
  ];

  return (
    <div className="min-h-screen  p-6">
      {/* HEADER (less boxed, more clean) */}
      <div className="rounded-2xl p-6 mb-6 shadow-md border border-black">
        <h1 className="text-3xl font-black text-black uppercase">
          Pharmacy Management
        </h1>
        <p className="text-black font-semibold">
          Review eKYC submissions & manage status
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pharmacy..."
          className="flex-1 rounded-xl border border-black px-4 py-3 font-semibold
                     focus:outline-none focus:ring-2 focus:ring-[#F06292]"
        />

        <button
          onClick={() => loadPharmacies(1)}
          className="rounded-xl bg-black text-white px-5 font-bold
                     hover:bg-gray-900"
        >
          Search
        </button>
      </div>

      {/* TABS (less boxy) */}
      <div className="flex gap-2 overflow-x-auto mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full border border-black font-bold whitespace-nowrap
              ${activeTab === tab.id ? "bg-[#F06292] text-black" : "bg-white"}`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {error && (
        <div className="bg-red-100 border border-black rounded-xl p-3 font-semibold mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-black p-6 font-bold">
          Loading...
        </div>
      ) : (
        <div className="space-y-12">
          {pharmacies.length === 0 ? (
            <div className="bg-white rounded-xl border border-black p-6 font-bold">
              No pharmacies found
            </div>
          ) : (
            pharmacies.map((pharmacy) => (
              <div key={pharmacy.id}>
                <PharmacyCard
                  pharmacy={pharmacy}
                  onApprove={() => openModal(pharmacy.id, "approve")}
                  onReject={() => openModal(pharmacy.id, "reject")}
                  onSuspend={() => openModal(pharmacy.id, "suspend")}
                  onPreviewDoc={(doc) => setPreviewDoc(doc)}
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* PAGINATION (clean minimal) */}
      <div className="flex justify-center items-center gap-3 mt-8">
        <button
          onClick={() => handlePageChange(pagination.current - 1)}
          disabled={pagination.current === 1}
          className="px-4 py-2 rounded-xl border border-black bg-white font-bold disabled:opacity-40"
        >
          Prev
        </button>

        <div className="px-4 py-2 rounded-xl bg-[#F06292] border border-black font-bold">
          {pagination.current} / {pagination.last}
        </div>

        <button
          onClick={() => handlePageChange(pagination.current + 1)}
          disabled={pagination.current === pagination.last}
          className="px-4 py-2 rounded-xl border border-black bg-white font-bold disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      <ActionModal
        isOpen={modal.open}
        type={modal.type}
        message={modal.message}
        onMessageChange={(v) => setModal((prev) => ({ ...prev, message: v }))}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />

      {/* PREVIEW */}
      {previewDoc && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white rounded-2xl border border-black p-4 max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewDoc.file_url}
              className="max-h-[80vh] rounded-xl border border-black"
            />

            <button
              onClick={() => setPreviewDoc(null)}
              className="mt-3 w-full bg-[#F06292] rounded-xl border border-black font-bold py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
