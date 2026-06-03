"use client";

import { Upload, CheckCircle, X, FileText } from "lucide-react";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import api from "@/lib/axios";
import Swal from "sweetalert2";

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function DocumentUploadFormStep({ files, setFiles, onSaved }) {
  const searchParams = useSearchParams();

  const ownerId = searchParams.get("owner_id");

  const [existing, setExisting] = useState({});
  const [loading, setLoading] = useState(false);

  // -----------------------
  // LOAD EXISTING DOCUMENTS
  // -----------------------
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true); // 👈 start loading

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
      } finally {
        setLoading(false); // 👈 stop loading
      }
    };

    if (ownerId) {
      fetchDocs();
    }
  }, [ownerId, setFiles]);
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
  // SAVE
  // -----------------------
  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(files).forEach(([key, file]) => {
        if (file instanceof File) {
          formData.append(key, file);
        }
      });

      await api.post(`/owners/${ownerId}/ekyc/step2`, formData);

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

      if (onSaved) {
        await onSaved();
      }

      await Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: "Documents uploaded successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err?.response?.data || err.message);
      await Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Please try again",
      });

      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // VALIDATION
  // -----------------------
  const isValid =
    files.id_front &&
    files.id_back &&
    (files.license || existing?.license) &&
    (files.professional || existing?.professional) &&
    (files.registration || existing?.registration);

  // -----------------------
  // IMAGE URL
  // -----------------------
  const getImageUrl = (fileKey) => {
    const file = files[fileKey];

    if (file && file !== "uploaded" && file instanceof File) {
      return URL.createObjectURL(file);
    }

    const existingFile = existing[fileKey]?.[0]?.file_url;

    if (existingFile) {
      return `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${existingFile}`;
    }

    return null;
  };

  // -----------------------
  // FILE BOX
  // -----------------------
  const FileBox = ({ label, desc, fileKey }) => {
    const imageUrl = getImageUrl(fileKey);

    return (
      <div className="border rounded-2xl p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* TOP */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold  text-xs sm:text-sm">{label}</h4>

            <p className="text-xs text-slate-500">{desc}</p>
          </div>

          {(files[fileKey] || existing[fileKey]?.[0]) && (
            <CheckCircle className="text-green-500" />
          )}
        </div>

        {/* IMAGE */}
        {imageUrl ? (
          <div className="space-y-3">
            <div className="relative w-full aspect-4/3 rounded-xl border overflow-hidden">
              <Image
                src={imageUrl}
                alt="document"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
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
                Replace
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(fileKey)}
                className="text-red-500"
              >
                Remove
              </Button>
            </div>
          </div>
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
              onClick={() => document.getElementById(fileKey).click()}
            >
              <Upload size={16} />
              Upload
            </Button>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-40 bg-gray-200 rounded-xl" />
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-pink-50 rounded-lg text-pink-500">
          <FileText size={20} />
        </div>

        <div>
          <h3 className="font-bold text-lg">Required Documents</h3>

          <p className="text-sm text-slate-500">
            Upload all required documents
          </p>
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="space-y-4">
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
      </div>

      {/* ID CARD */}
      <div className="border rounded-2xl p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div>
          <h4 className="font-semibold">National ID Card</h4>

          <p className="text-sm text-slate-500">
            Upload both front and back side
          </p>
        </div>

        <div className="grid grid-cols-1  gap-3 sm:gap-4">
          {[
            {
              key: "id_front",
              label: "Front Side",
            },
            {
              key: "id_back",
              label: "Back Side",
            },
          ].map((item) => {
            const imageUrl = getImageUrl(item.key);

            return (
              <div
                key={item.key}
                className="
                  p-4
                  space-y-3
                "
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>

                  {(files[item.key] || existing[item.key]?.[0]) && (
                    <CheckCircle className="text-green-500" />
                  )}
                </div>

                {imageUrl ? (
                  <>
                    <div className="relative w-full h-52 rounded-lg border overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt="document"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="file"
                        id={item.key}
                        hidden
                        onChange={(e) =>
                          handleFileChange(item.key, e.target.files[0])
                        }
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById(item.key).click()
                        }
                      >
                        Replace
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => removeFile(item.key)}
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      id={item.key}
                      hidden
                      onChange={(e) =>
                        handleFileChange(item.key, e.target.files[0])
                      }
                    />

                    <Button
                      variant="outline"
                      onClick={() => document.getElementById(item.key).click()}
                    >
                      <Upload size={16} />
                      Upload
                    </Button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SAVE */}
      <div className="pt-4">
        <Button
          onClick={handleSave}
          disabled={!isValid || loading}
          className="
            w-full bg-[#F06292]
            hover:bg-pink-600
            text-white
          "
        >
          {loading ? "Uploading..." : "Save Documents"}
        </Button>
      </div>
    </div>
  );
}
