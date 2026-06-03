"use client";
import Image from "next/image";

import React, { useState, useRef, useEffect } from "react";

import {
  Camera,
  ChevronRight,
  ChevronLeft,
  Upload,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export function SelfieStep({ onNext, onBack, ownerId }) {
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [existingSelfie, setExistingSelfie] = useState(null);

  const [result, setResult] = useState(null);

  // loading states
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [verifying, setVerifying] = useState(false);

  const inputRef = useRef(null);

  // =========================
  // LOAD DATA
  // =========================
  const fetchData = async () => {
    try {
      setLoading(true);

      // selfie
      const selfieRes = await api.get(`/owners/${ownerId}/ekyc/selfie`);

      if (selfieRes.data?.selfie_url) {
        setExistingSelfie(`${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${selfieRes.data.selfie_url}`);
      }

      // verification result
      const resultRes = await api.get(`/owners/${ownerId}/ekyc/face-result`);

      if (resultRes.data?.score !== undefined) {
        setResult(resultRes.data);
      }
    } catch {
      console.log("No selfie yet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ownerId) {
      fetchData();
    }
  }, [ownerId]);

  // =========================
  // PICK IMAGE
  // =========================
  const handleCapture = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    setFile(selected);

    setPreview(URL.createObjectURL(selected));

    setResult(null);
  };

  // =========================
  // RETAKE
  // =========================
  const handleRetake = () => {
    setFile(null);
    setPreview(null);
  };

  // =========================
  // UPLOAD SELFIE
  // =========================
  const handleUpload = async () => {
    if (!file) return;

    const toastId = toast.loading("Uploading selfie...");

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("selfie", file);

      await api.post(`/owners/${ownerId}/ekyc/selfie`, formData);

      setExistingSelfie(preview);

      setFile(null);

      toast.success("Selfie uploaded", {
        id: toastId,
      });
    } catch {
      toast.error("Upload failed", {
        id: toastId,
      });
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // VERIFY FACE
  // =========================
  const handleVerify = async () => {
    const toastId = toast.loading("Verifying face...");

    try {
      setVerifying(true);

      const res = await api.post(`/owners/${ownerId}/ekyc/step3`);

      setResult(res.data.result);

      toast.success("Verification completed", {
        id: toastId,
      });

      onNext?.();
    } catch {
      toast.error("Verification failed", {
        id: toastId,
      });
    } finally {
      setVerifying(false);
    }
  };

  // =========================
  // PAGE LOADING
  // =========================
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-52 bg-pink-100 rounded animate-pulse" />

          <div className="h-4 w-72 bg-gray-100 rounded mt-2 animate-pulse" />
        </div>

        <div className="border rounded-3xl p-10">
          <div className="w-32 h-32 rounded-full bg-gray-100 animate-pulse mx-auto" />

          <div className="h-10 w-40 bg-gray-100 rounded-xl animate-pulse mx-auto mt-6" />
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="space-y-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* HEADER */}
      <div>
        <h3 className="text-2xl font-bold text-pink-600">
          Selfie Verification
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Upload a clear selfie for identity verification
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white  rounded-3xl p-6">
        {/* IMAGE */}
        <div className="flex justify-center">
          {preview || existingSelfie ? (
<div className="w-44 h-44 mx-auto relative rounded-full overflow-hidden border-4 border-pink-100">
    <Image
      src={preview || existingSelfie}
      alt="selfie"
      fill
      className="object-cover"
      unoptimized
    />
  </div>
          ) : (
            <div
              className="
                w-44
                h-44
                rounded-full
                bg-pink-50
                border-2
                border-dashed
                border-pink-200
                flex
                flex-col
                items-center
                justify-center
                text-pink-300
              "
            >
              <Camera size={42} />

              <span className="text-sm mt-2">No Selfie</span>
            </div>
          )}
        </div>

        {/* STATUS */}
        {existingSelfie && !preview && (
          <p className="text-center text-sm text-green-600 mt-4">
            Selfie uploaded
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Button
            onClick={handleCapture}
            className="
              bg-pink-500
              hover:bg-pink-600
              text-white
            "
            disabled={uploading || verifying}
          >
            <Upload className="mr-2" size={16} />

            {preview || existingSelfie ? "Replace Selfie" : "Select Selfie"}
          </Button>

          {preview && (
            <>
              <Button variant="outline" onClick={handleRetake}>
                Retake
              </Button>

              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="
                  bg-gray-800
                  hover:bg-black
                  text-white
                "
              >
                {uploading ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* RESULT */}
      {result && (
        <div className="border rounded-2xl p-5 text-center bg-white">
          {result.passed ? (
            <div className="text-green-600 flex flex-col items-center">
              <CheckCircle2 size={42} />

              <p className="font-semibold mt-2">Face matched successfully</p>
            </div>
          ) : (
            <div className="text-red-500 flex flex-col items-center">
              <XCircle size={42} />

              <p className="font-semibold mt-2">Face mismatch</p>
            </div>
          )}

          <div className="mt-3 text-sm text-gray-500">
            Score: {result.score}
          </div>

          <div className="text-sm text-gray-500">
            Threshold: {result.threshold}
          </div>
        </div>
      )}

      {/* VERIFY */}
      {(existingSelfie || preview) && (
        <div className="flex justify-center">
          <Button
            onClick={handleVerify}
            disabled={verifying || uploading}
            className="
              bg-pink-500
              hover:bg-pink-600
              text-white
              px-8
            "
          >
            {verifying ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Run Verification
                <ChevronRight size={18} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      )}

      {/* BACK */}
      <div className="flex justify-start">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft size={18} />
          Back
        </Button>
      </div>
    </div>
  );
}
