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

    await pharmacyService.updatePharmacyStatus(
      modal.id,
      newStatus,
      modal.message
    );

    closeModal();
    loadPharmacies(pagination.current);
  };

  const tabs = [
    { id: "all", label: "ALL", count: counts.all },
    { id: "pending", label: "PENDING", count: counts.pending },
    { id: "approved", label: "APPROVED", count: counts.approved },
    { id: "rejected", label: "REJECTED", count: counts.rejected },
    { id: "suspended", label: "SUSPENDED", count: counts.suspended },
  ];

  return (
    <div className="min-h-screen bg-[#fff0f5] p-6">

      {/* HEADER */}
      <div className="border-4 border-black bg-[#F06292] shadow-[6px_6px_0px_black] p-6 mb-6">
        <h1 className="text-3xl font-black text-black">
          PHARMACY MANAGEMENT
        </h1>
        <p className="text-black font-bold">
          Review eKYC submissions & manage status
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH PHARMACY..."
          className="flex-1 border-4 border-black p-3 font-bold uppercase
                     shadow-[4px_4px_0px_black] focus:outline-none"
        />

        <button
          onClick={() => loadPharmacies(1)}
          className="bg-black text-white font-black px-5 border-4 border-black
                     shadow-[4px_4px_0px_#F06292]"
        >
          SEARCH
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-3 overflow-x-auto mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`border-4 border-black px-4 py-2 font-black whitespace-nowrap
              shadow-[4px_4px_0px_black]
              ${
                activeTab === tab.id
                  ? "bg-[#F06292] text-black"
                  : "bg-white"
              }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {error && (
        <div className="bg-red-200 border-4 border-black p-3 font-bold mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="border-4 border-black p-6 font-black bg-white shadow-[4px_4px_0px_black]">
          LOADING...
        </div>
      ) : (
        <div className="space-y-6">
          {pharmacies.length === 0 ? (
            <div className="border-4 border-black p-6 font-black bg-white">
              NO PHARMACIES FOUND
            </div>
          ) : (
            pharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className="border-4 border-black bg-white p-4
                           shadow-[6px_6px_0px_black]"
              >
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

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 mt-8">
        <button
          onClick={() => handlePageChange(pagination.current - 1)}
          disabled={pagination.current === 1}
          className="border-4 border-black px-4 py-2 font-black bg-white
                     shadow-[4px_4px_0px_black] disabled:opacity-40"
        >
          PREV
        </button>

        <div className="border-4 border-black px-4 py-2 font-black bg-[#F06292]
                        shadow-[4px_4px_0px_black]">
          {pagination.current} / {pagination.last}
        </div>

        <button
          onClick={() => handlePageChange(pagination.current + 1)}
          disabled={pagination.current === pagination.last}
          className="border-4 border-black px-4 py-2 font-black bg-white
                     shadow-[4px_4px_0px_black] disabled:opacity-40"
        >
          NEXT
        </button>
      </div>

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

      {/* PREVIEW */}
      {previewDoc && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_black]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewDoc.file_url}
              className="max-h-[80vh] border-4 border-black"
            />

            <button
              onClick={() => setPreviewDoc(null)}
              className="mt-3 w-full bg-[#F06292] border-4 border-black
                         font-black p-2 shadow-[4px_4px_0px_black]"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}