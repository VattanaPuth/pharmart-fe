"use client";

import {
  Upload,
  CheckCircle,
  X,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function DocumentUploadFormStep({
  onBack,
  onNext,
  ownerId,
}) {
  const [files, setFiles] = useState({});
  const [existing, setExisting] = useState({});
  const [previewFile, setPreviewFile] = useState(null);

  // page loading
  const [loading, setLoading] = useState(true);

  // upload loading
  const [uploading, setUploading] = useState({});

  // =========================
  // FETCH DOCUMENTS
  // =========================
  const fetchDocs = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/owners/${ownerId}/ekyc/getstep2`
      );

      setExisting(res.data || {});
    } catch {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ownerId) {
      fetchDocs();
    }
  }, [ownerId]);

  // =========================
  // IMAGE URL
  // =========================
  const getImageUrl = (file, existingFile) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }

    if (existingFile?.[0]?.file_url) {
      return `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${existingFile[0].file_url}`;
    }

    return null;
  };

  // =========================
  // CHECK COMPLETE
  // =========================
  const checkCompleted = (data) => {
    return (
      data?.license &&
      data?.professional &&
      data?.registration &&
      data?.id_front &&
      data?.id_back
    );
  };

  // =========================
  // UPLOAD FILE
  // =========================
  const uploadFile = async (key, file) => {
    if (!file) return;

    const toastId = toast.loading("Uploading...");

    setUploading((prev) => ({
      ...prev,
      [key]: true,
    }));

    try {
      const formData = new FormData();
      formData.append(key, file);

      await api.post(
        `/owners/${ownerId}/ekyc/step2`,
        formData
      );

      const res = await api.get(
        `/owners/${ownerId}/ekyc/getstep2`
      );

      const updated = res.data || {};

      setExisting(updated);

      // clear temp local file
      setFiles((prev) => ({
        ...prev,
        [key]: null,
      }));

      toast.success("Uploaded successfully", {
        id: toastId,
      });

      // auto next
      if (checkCompleted(updated)) {
        toast.success("All documents completed");

        setTimeout(() => {
          onNext?.();
        }, 500);
      }
    } catch {
      toast.error("Upload failed", {
        id: toastId,
      });
    } finally {
      setUploading((prev) => ({
        ...prev,
        [key]: false,
      }));
    }
  };

  // =========================
  // HANDLE FILE CHANGE
  // =========================
  const handleFileChange = (key, file) => {
    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));

    uploadFile(key, file);
  };

  // =========================
  // CARD
  // =========================
  const ImageCard = ({ label, fileKey }) => {
    const file = files[fileKey];
    const existingFile = existing?.[fileKey];

    const imageUrl = getImageUrl(file, existingFile);

    const isUploading = uploading[fileKey];

    return (
      <div className="bg-white border border-pink-100 rounded-2xl p-4">

        {/* TOP */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-800">
              {label}
            </h4>

            <p className="text-xs text-gray-500">
              Tap image to preview
            </p>
          </div>

          {isUploading ? (
            <RefreshCw
              size={20}
              className="animate-spin text-pink-500"
            />
          ) : imageUrl ? (
            <CheckCircle
              size={20}
              className="text-pink-500"
            />
          ) : (
            <Upload
              size={20}
              className="text-gray-300"
            />
          )}
        </div>

        {/* IMAGE */}
        <div
          onClick={() =>
            imageUrl && setPreviewFile(imageUrl)
          }
          className="
            h-44
            border-t-2
            overflow-hidden
            cursor-pointer
          "
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              className="
                w-full
                h-full
                object-contain
                hover:scale-[1.02]
                transition
              "
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <Upload size={28} />
              <span className="text-sm mt-2">
                No Image
              </span>
            </div>
          )}
        </div>

        {/* BUTTON */}
        <input
          type="file"
          hidden
          id={fileKey}
          onChange={(e) =>
            handleFileChange(
              fileKey,
              e.target.files[0]
            )
          }
        />

        <Button
          className="
            w-full
            mt-3
            bg-pink-500
            hover:bg-pink-600
            text-white
          "
          disabled={isUploading}
          onClick={() =>
            document
              .getElementById(fileKey)
              .click()
          }
        >
          {isUploading
            ? "Uploading..."
            : imageUrl
            ? "Replace Image"
            : "Upload Image"}
        </Button>
      </div>
    );
  };

  // =========================
  // LOADING SCREEN
  // =========================
  if (loading) {
    return (
      <div className="space-y-6">

        <div>
          <div className="h-7 w-52 bg-pink-100 rounded animate-pulse" />
          <div className="h-4 w-72 bg-gray-100 rounded mt-2 animate-pulse" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h3 className="text-2xl font-bold text-pink-600">
          Upload Documents
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Images upload instantly after selection
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-4">

        <ImageCard
          label="Pharmacy License"
          fileKey="license"
        />

        <ImageCard
          label="Pharmacist License"
          fileKey="professional"
        />

        <ImageCard
          label="Business Registration"
          fileKey="registration"
        />

        <ImageCard
          label="National ID Front"
          fileKey="id_front"
        />

        <ImageCard
          label="National ID Back"
          fileKey="id_back"
        />
      </div>

      {/* BACK */}
      <div>
        <Button
          variant="outline"
          onClick={onBack}
        >
          <ChevronLeft size={18} />
          Back
        </Button>
      </div>

      {/* MODAL */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">

          <div className="relative max-w-5xl w-full">

            <button
              onClick={() => setPreviewFile(null)}
              className="
                absolute
                -top-12
                right-0
                text-white
              "
            >
              <X size={28} />
            </button>

            <img
              src={previewFile}
              className="
                w-full
                max-h-[90vh]
                object-contain
                rounded-2xl
                bg-white
              "
            />
          </div>
        </div>
      )}
    </div>
  );
}