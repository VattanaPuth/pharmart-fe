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

  const requiredDocs = pharmacy?.documents?.required || [];
  const docs = pharmacy?.documents || [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* HEADER */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          {/* LEFT */}
          <div className="flex gap-4">
            <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-gray-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {pharmacy.name}
              </h2>

              <p className="text-sm text-gray-600">{pharmacy.owner}</p>

              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-600">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${ekycStatus.badgeColor}`}
                >
                  <EKycIcon className="w-3 h-3" />
                  KYC selfie vs ID picture matching score: {ekycMatch}%
                </span>

                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {pharmacy.location.city}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {statusBadge.label}
            </span>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-400 hover:text-gray-600 transition"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* REVIEW MESSAGE */}
        {pharmacy?.ekyc?.message && (
          <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <p className="text-xs text-gray-500 mb-1">Review Message</p>
            <p className="text-sm text-gray-700">{pharmacy.ekyc.message}</p>
          </div>
        )}
      </div>

      {/* EXPAND */}
      {isExpanded && (
        <div className="p-5 bg-gray-50 border-b border-gray-100 text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium text-gray-700">Phone:</span>{" "}
            {pharmacy.contact?.phone}
          </p>

          <p>
            <span className="font-medium text-gray-700">Email:</span>{" "}
            {pharmacy.contact?.email}
          </p>

          <p>
            <span className="font-medium text-gray-700">Address:</span>{" "}
            {pharmacy.location.address}
          </p>
        </div>
      )}

      {/* ================= DOCUMENT PLACEHOLDERS ================= */}

      <div className="p-5 border-t border-gray-100">
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Required Documents
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DocumentItem
            label="License"
            doc={docs.find((d) => d.type === "license")}
            onPreview={onPreviewDoc}
          />

          <DocumentItem
            label="Professional Certificate"
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

      {/* ACTIONS */}
      <div className="p-5 flex flex-wrap gap-3">
        {pharmacy.status === "pending" && (
          <>
            <button
              onClick={onApprove}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
            >
              Approve
            </button>

            <button
              onClick={onReject}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg"
            >
              Reject
            </button>
          </>
        )}

        {pharmacy.status === "approved" && (
          <button
            onClick={onSuspend}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white text-sm rounded-lg"
          >
            Suspend
          </button>
        )}

        {(pharmacy.status === "suspended" ||
          pharmacy.status === "rejected") && (
          <button
            onClick={onApprove}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
          >
            Re-Approve
          </button>
        )}

        <Link
  href={`/admin/pharmacies/${pharmacy.id}`}
  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
>
  View Full
</Link>
      </div>
    </div>
  );
}

function DocumentItem({ label, doc, onPreview }) {
  const missing = !doc;

  return (
    <button
      onClick={() => doc && onPreview?.(doc)}
      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition text-sm
        ${
          missing
            ? "border-red-200 bg-red-50 hover:bg-red-100"
            : "border-green-200 bg-green-50 hover:bg-green-100"
        }`}
    >
      <div className="text-left">
        <p
          className={`font-medium ${missing ? "text-red-700" : "text-green-800"}`}
        >
          {label}
        </p>

        <p className="text-xs text-gray-500 mt-0.5">
          {missing ? "Not uploaded" : "Uploaded"}
        </p>
      </div>

      <span className="text-xs font-semibold">
        {missing ? "Missing" : "View"}
      </span>
    </button>
  );
}
