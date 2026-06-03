"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

import { ArrowLeft, Clock } from "lucide-react";

export default function PharmacyDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);

      // ✅ FIXED ENDPOINT
      const res = await api.get(`/admin/pharmacies/detail/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  if (!data) {
    return <div className="p-8 text-red-500">Pharmacy not found</div>;
  }

  const statusColor = {
    approved: "text-green-600",
    pending: "text-yellow-600",
    rejected: "text-red-600",
    suspended: "text-gray-600",
  };

  // ✅ BUILD REAL TIMELINE (since backend doesn't send it)
  const timeline = [
    {
      title: "Submitted eKYC",
      date: data.ekyc?.submitted_at,
    },
    {
      title: "Current Status",
      date: data.ekyc?.submitted_at,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-600 mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* HEADER */}
      <div className="bg-white p-5 rounded-xl border mb-6">
        <h1 className="text-xl font-semibold">{data.name}</h1>
        <p className="text-sm text-gray-500">{data.owner}</p>

        <p className={`mt-2 font-medium ${statusColor[data.status]}`}>
          Status: {data.status}
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* EKYC INFO */}
          <div className="bg-white p-5 rounded-xl border">
            <h2 className="font-semibold mb-3">eKYC Info</h2>

            <p className="text-sm">
              Status: <b>{data.ekyc?.status}</b>
            </p>

            <p className="text-sm">Submitted: {data.ekyc?.submitted_at}</p>

            <p className="text-sm mt-2 text-gray-600">
              Review: {data.ekyc?.review_message || "—"}
            </p>
          </div>

          {/* DOCUMENTS */}
          {/* DOCUMENTS FULL VIEW */}
          <div className="bg-white p-5 rounded-xl border">
            <h2 className="font-semibold mb-4">Documents</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.documents?.length ? (
                data.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    {/* IMAGE */}
                    <img
                      // src={doc.file_url}

                      src={
                        doc.file_url
                          ? doc.file_url.startsWith("http") ||
                            doc.file_url.includes("amazon")
                            ? doc.file_url
                            :  `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${doc.file_url}`
                          : "/placeholder.png"
                      }
                      alt={doc.type}
                      className="w-full h-48 object-contain bg-gray-100"
                    />

                    {/* INFO */}
                    <div className="p-3">
                      <p className="text-sm font-semibold capitalize">
                        {doc.type.replace("_", " ")}
                      </p>

                      <p
                        className={`text-xs mt-1 ${
                          doc.status === "approved"
                            ? "text-green-600"
                            : doc.status === "rejected"
                              ? "text-red-500"
                              : "text-yellow-600"
                        }`}
                      >
                        {doc.status}
                      </p>

                      {doc.review_message && (
                        <p className="text-xs text-gray-500 mt-1">
                          {doc.review_message}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No documents found</p>
              )}
            </div>
          </div>
          {/* TIMELINE */}
          <div className="bg-white p-5 rounded-xl border">
            <h2 className="font-semibold mb-4">Timeline</h2>

            <div className="space-y-4">
              {timeline.map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Clock size={16} className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-gray-500">{t.date || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* CONTACT */}
          <div className="bg-white p-5 rounded-xl border">
            <h2 className="font-semibold mb-3">Contact</h2>

            <p className="text-sm">Phone: {data.contact?.phone}</p>

            <p className="text-sm">Email: {data.contact?.email}</p>
          </div>

          {/* LOCATION */}
          <div className="bg-white p-5 rounded-xl border">
            <h2 className="font-semibold mb-3">Location</h2>

            <p className="text-sm">City: {data.location?.city}</p>

            <p className="text-sm">Address: {data.location?.address}</p>
          </div>
        </div>
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        >
          <img src={preview} className="max-h-[90vh] rounded-lg" />
        </div>
      )}
    </div>
  );
}
