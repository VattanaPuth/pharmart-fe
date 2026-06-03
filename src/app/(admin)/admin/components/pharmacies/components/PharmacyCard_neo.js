"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Shield,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { pharmacyService } from "../../../services/pharmacyService";
import { MdEmail, MdLocationPin, MdPhone } from "react-icons/md";

export default function PharmacyCard({
  pharmacy,
  onApprove,
  onReject,
  onSuspend,
  onPreviewDoc,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const ekycMatch = pharmacy?.ekyc?.face?.score ?? 0;

  const ekycStatus = pharmacyService.getEKYCStatus(ekycMatch);
  const statusBadge = pharmacyService.getStatusBadge(pharmacy.status);

  const StatusIcon =
    {
      approved: CheckCircle,
      pending: AlertCircle,
      rejected: XCircle,
      suspended: Shield,
    }[pharmacy.status] || AlertCircle;

  const EKycIcon =
    {
      high: CheckCircle,
      medium: AlertCircle,
      low: XCircle,
    }[ekycStatus.level] || AlertCircle;

  const docs = pharmacy?.documents || [];

  return (
    <div className="border-4 border-black bg-white shadow-[6px_6px_0px_black] rounded-xl overflow-hidden">

      {/* HEADER */}
      <div className="p-5 border-b-4 border-black bg-[#F06292]">

        <div className="flex justify-between items-start gap-4">

          {/* LEFT */}
          <div className="flex gap-4">

            <div className="w-12 h-12 border-4 border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_black] rounded-lg">
              <Shield className="w-5 h-5 text-black" />
            </div>

            <div>
              <h2 className="text-xl font-black uppercase text-black">
                {pharmacy.name}
              </h2>

              <p className="text-sm font-bold text-black">
                {pharmacy.owner}
              </p>

              <div className="flex flex-wrap gap-2 mt-2 text-xs font-bold">

                <span className="border border-black bg-white px-2 py-1 rounded-md flex items-center gap-1">
                  <EKycIcon className="w-3 h-3" />
                  KYC {ekycMatch}%
                </span>

                <span className="border border-black bg-white px-2 py-1 rounded-md flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {pharmacy.location.city}
                </span>

              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">

            <span className="border-2 border-black bg-white px-3 py-1 text-xs font-black rounded-md flex items-center gap-1">
              <StatusIcon className="w-4 h-4" />
              {statusBadge.label}
            </span>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="border-2 border-black bg-white p-1 rounded-md shadow-sm"
            >
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </button>

          </div>
        </div>

        {/* REVIEW */}
        {pharmacy?.ekyc?.message && (
          <div className="mt-4 border border-black bg-white p-3 rounded-md">
            <p className="text-xs font-black uppercase text-gray-700">
              Review Message
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {pharmacy.ekyc.message}
            </p>
          </div>
        )}
      </div>

      {/* EXPANDED */}
      {isExpanded && (
        <div className="p-5 border-b-4 border-black bg-gray-50 text-sm space-y-1 font-medium text-gray-700">
          <p className="flex gap-2"><MdPhone/> {pharmacy.contact?.phone}</p>
          <p className="flex gap-2"><MdEmail/> {pharmacy.contact?.email}</p>
          <p className="flex gap-2"><MdLocationPin/> {pharmacy.location.address}</p>
        </div>
      )}

      {/* DOCUMENTS */}
      <div className="p-5 border-b-4 border-black">

        <p className="font-black uppercase mb-3 text-gray-800">
          Documents
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <DocumentItem
            label="License"
            doc={docs.find((d) => d.type === "license")}
            onPreview={onPreviewDoc}
          />

          <DocumentItem
            label="Professional"
            doc={docs.find((d) => d.type === "professional")}
            onPreview={onPreviewDoc}
          />

          <DocumentItem
            label="Registration"
            doc={docs.find((d) => d.type === "registration")}
            onPreview={onPreviewDoc}
          />

          <DocumentItem
            label="ID Front"
            doc={docs.find((d) => d.type === "id_front")}
            onPreview={onPreviewDoc}
          />

          <DocumentItem
            label="ID Back"
            doc={docs.find((d) => d.type === "id_back")}
            onPreview={onPreviewDoc}
          />

        </div>
      </div>

      {/* ACTIONS (reduced colors) */}
      <div className="p-5 flex flex-wrap gap-3 bg-gray-100">

        {pharmacy.status === "pending" && (
          <>
            <button
              onClick={onApprove}
              className="border-2 border-black bg-white px-4 py-2 font-black rounded-md shadow-sm"
            >
              Approve
            </button>

            <button
              onClick={onReject}
              className="border-2 border-black bg-white px-4 py-2 font-black rounded-md shadow-sm"
            >
              Reject
            </button>
          </>
        )}

        {pharmacy.status === "approved" && (
          <button
            onClick={onSuspend}
            className="border-2 border-black bg-white px-4 py-2 font-black rounded-md shadow-sm"
          >
            Suspend
          </button>
        )}

        {(pharmacy.status === "suspended" ||
          pharmacy.status === "rejected") && (
          <button
            onClick={onApprove}
            className="border-2 border-black bg-white px-4 py-2 font-black rounded-md shadow-sm"
          >
            Re-Approve
          </button>
        )}

        <Link
          href={`/admin/pharmacies/${pharmacy.id}`}
          className="border-2 border-black bg-black text-white px-4 py-2 font-black rounded-md"
        >
          View Full
        </Link>

      </div>
    </div>
  );
}

/* ================= DOCUMENT ITEM ================= */
function DocumentItem({ label, doc, onPreview }) {
  const missing = !doc;

  return (
    <button
      onClick={() => doc && onPreview?.(doc)}
      className="border border-black p-3 font-semibold rounded-md bg-white hover:bg-gray-50"
    >
      <div className="flex justify-between items-center">

        <div>
          <p className="uppercase text-sm font-bold text-gray-800">
            {label}
          </p>

          <p className="text-xs text-gray-500">
            {missing ? "Missing" : "Uploaded"}
          </p>
        </div>

        <span className="text-xs font-black text-gray-600">
          {missing ? "-" : "View"}
        </span>

      </div>
    </button>
  );
}