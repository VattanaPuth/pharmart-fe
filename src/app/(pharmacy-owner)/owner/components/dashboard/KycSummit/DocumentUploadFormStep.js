"use client";

import {
  Upload,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function DocumentUploadFormStep({ onBack, onNext, ownerId }) {
  const searchParams = useSearchParams();
  // const ownerId = searchParams.get("owner_id");

  const [files, setFiles] = useState({
    license: null,
    professional: null,
    registration: null,
    id_front: null,
    id_back: null,
  });

  const [existing, setExisting] = useState({});
  const [previewFile, setPreviewFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const openPreview = (file) => {
    if (!file) return;

    if (typeof file === "string") {
      // server file
      setPreviewFile({
        type: "server",
        url: file,
      });
    } else {
      // local file
      setPreviewFile({
        type: "local",
        url: URL.createObjectURL(file),
        name: file.name,
      });
    }
  };

  // -----------------------
  // LOAD EXISTING DOCUMENTS (GETTER)
  // -----------------------
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get(`/owners/${ownerId}/ekyc/getstep2`);
        const data = res.data;

        if (data) {
          setExisting(data);

          const mapped = {};

          Object.keys(data).forEach((key) => {
            const doc = data[key]?.[0];
            if (doc?.file_url) {
              mapped[key] = "uploaded";
            }
          });

          setFiles((prev) => ({
            ...prev,
            ...mapped,
          }));
        }
      } catch (err) {
        console.log("No existing documents");
      }
    };

    if (ownerId) fetchDocs();
  }, [ownerId]);

  // -----------------------
  // FILE HANDLING
  // -----------------------
  const handleFileChange = (key, file) => {
    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));
  };

  const removeFile = (key) => {
    setFiles((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  // -----------------------
  // SUBMIT
  // -----------------------
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

Object.entries(files).forEach(([key, file]) => {
  if (file instanceof File) {
    formData.append(key, file);
  }
});

      await api.post(`/owners/${ownerId}/ekyc/step2`, formData);

      // ✅ IMPORTANT: reload documents
      const res = await api.get(`/owners/${ownerId}/ekyc/getstep2`);
      const data = res.data;

      setExisting(data);

      const mapped = {};
      Object.keys(data).forEach((key) => {
        if (data[key]?.[0]?.file_url) {
          mapped[key] = "uploaded";
        }
      });

      setFiles((prev) => ({
        ...prev,
        ...mapped,
      }));

      onNext();
    } catch (err) {
      console.error(err?.response?.data || err.message);
      //alert("Upload failed");
      toast.error("Upload failed");
      
    } finally {
      setLoading(false);
    }
  };
  const isValid =
    files.id_front &&
    files.id_back &&
    (files.license || existing?.license) &&
    (files.professional || existing?.professional) &&
    (files.registration || existing?.registration);

  // -----------------------
  // FILE BOX
  // -----------------------
  const FileBox = ({ label, desc, fileKey }) => {
    const uploaded = files[fileKey] === "uploaded";
    const doc = existing[fileKey]?.[0];

    return (
      <div className="flex justify-between items-center p-4 border rounded-xl">
        <div>
          <h4 className="font-semibold text-sm">{label}</h4>
          <p className="text-xs text-slate-500">{desc}</p>

          {/* SERVER FILE */}
          {uploaded && (
            <div className="flex gap-2 mt-1">
              <button
                className="text-xs text-blue-600"
                onClick={() => openPreview(doc?.file_url)}
              >
                Preview
              </button>

              <button
                className="text-xs text-red-500"
                onClick={() => removeFile(fileKey)}
              >
                Replace
              </button>
            </div>
          )}

          {/* LOCAL FILE */}
          {files[fileKey] && files[fileKey] !== "uploaded" && (
            <div className="flex gap-2 mt-1">
              <button
                className="text-xs text-blue-600"
                onClick={() => openPreview(files[fileKey])}
              >
                Preview
              </button>

              <button
                className="text-xs text-red-500"
                onClick={() => removeFile(fileKey)}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {uploaded ? (
            <CheckCircle className="text-green-500" />
          ) : files[fileKey] ? (
            <>
              <CheckCircle className="text-green-500" />
              <button onClick={() => removeFile(fileKey)}>
                <X size={16} className="text-red-400" />
              </button>
            </>
          ) : (
            <>
              <input
                type="file"
                id={fileKey}
                hidden
                onChange={(e) => handleFileChange(fileKey, e.target.files[0])}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById(fileKey).click()}
              >
                <Upload size={14} /> Upload
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h3 className="font-bold text-lg">Required Documents</h3>
        <p className="text-sm text-slate-500">Upload all required documents</p>
      </div>

      {/* FILES */}
      <div className="space-y-3">
        <FileBox
          label="Pharmacy License"
          desc="Business license"
          fileKey="license"
        />

        <FileBox
          label="Pharmacist License"
          desc="Professional certificate"
          fileKey="professional"
        />

        <FileBox
          label="Business Registration"
          desc="Company certificate"
          fileKey="registration"
        />

        {/* ID */}
        <div className="p-4 border rounded-xl space-y-3">
          <h4 className="font-semibold text-sm">National ID Card</h4>

          <div className="grid sm:grid-cols-2 gap-3">
            {["id_front", "id_back"].map((key) => {
              const uploaded = files[key] === "uploaded";
              const doc = existing[key]?.[0];

              return (
                <div
                  key={key}
                  className="flex justify-between items-center border p-3 rounded-lg"
                >
                  <span className="text-xs text-slate-500">
                    {key === "id_front" ? "Front" : "Back"}
                  </span>

                  {uploaded ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-500" />
                      <button
                        className="text-xs text-blue-600"
                        onClick={() =>
                          openPreview(uploaded ? doc?.file_url : files[key])
                        }
                      >
                        Preview
                      </button>
                    </div>
                  ) : files[key] ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <>
                      <input
                        type="file"
                        id={key}
                        hidden
                        onChange={(e) =>
                          handleFileChange(key, e.target.files[0])
                        }
                      />

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => document.getElementById(key).click()}
                      >
                        <Upload size={14} /> Upload
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft size={18} /> Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="bg-pink-300 text-white"
        >
          {loading ? "Uploading..." : "Continue"}
          <ChevronRight size={18} />
        </Button>
      </div>

      {/* -----------------------
          PREVIEW MODAL
      ----------------------- */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl w-full max-w-3xl relative">
            <button
              className="absolute top-2 right-2"
              onClick={() => setPreviewFile(null)}
            >
              <X />
            </button>

            {previewFile.url.endsWith(".pdf") ? (
              <iframe
                src={
                  previewFile.type === "server"
                    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${previewFile.url}`
                    : previewFile.url
                }
                className="w-full h-150"
              />
            ) : (
              <img
                src={
                  previewFile.type === "server"
                    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${previewFile.url}`
                    : previewFile.url
                }
                className="w-full rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
