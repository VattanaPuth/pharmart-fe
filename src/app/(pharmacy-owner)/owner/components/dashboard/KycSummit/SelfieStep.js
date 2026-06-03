"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  ChevronRight,
  ChevronLeft,
  Upload,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export function SelfieStep({ onNext, onBack ,ownerId}) {
  const searchParams = useSearchParams();
  // const ownerId = searchParams.get("owner_id");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingSelfie, setExistingSelfie] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  // -----------------------
  // LOAD SELFIE + RESULT
  // -----------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // GET SELFIE
        const selfieRes = await api.get(
          `/owners/${ownerId}/ekyc/selfie`
        );

        if (selfieRes.data?.selfie_url) {
          setExistingSelfie(selfieRes.data.selfie_url);
        }

        // GET RESULT
        const resultRes = await api.get(
          `/owners/${ownerId}/ekyc/face-result`
        );

        if (resultRes.data?.score !== undefined) {
          setResult(resultRes.data);
        }
      } catch (err) {
        console.log("No data yet");
      }
    };

    if (ownerId) fetchData();
  }, [ownerId]);

  // -----------------------
  // PICK FILE
  // -----------------------
  const handleCapture = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleRetake = () => {
    setFile(null);
    setPreview(null);
  };

  // -----------------------
  // UPLOAD SELFIE
  // -----------------------
  const handleUpload = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("selfie", file);

      await api.post(`/owners/${ownerId}/ekyc/selfie`, formData);

      setExistingSelfie(preview);
      setFile(null);
    } catch (err) {
      console.error(err);
      //alert("Upload failed");
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // VERIFY SELFIE (STEP 3)
  // -----------------------
  const handleVerify = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        `/owners/${ownerId}/ekyc/step3`
      );

      setResult(res.data.result);

      onNext(); // update progress
    } catch (err) {
      console.error(err);
      //alert("Verification failed");
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // UI
  // -----------------------
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
        <h3 className="font-bold text-lg">Selfie Verification</h3>
        <p className="text-xs text-slate-400">
          Upload and verify your identity
        </p>
      </div>

      {/* EXISTING SELFIE */}
      {existingSelfie && !file && (
        <div className="text-center">
          <img
            src={existingSelfie}
            className="w-32 h-32 rounded-full object-cover mx-auto border"
          />
          <p className="text-xs text-green-600 mt-2">
            Selfie uploaded
          </p>
        </div>
      )}

      {/* UPLOAD */}
      {!file ? (
        <div className="border-2 border-dashed rounded-2xl p-10 text-center">
          <Camera size={40} className="mx-auto mb-4 text-gray-300" />

          <Button onClick={handleCapture}>
            <Upload className="mr-2" size={16} />
            Select Selfie
          </Button>
        </div>
      ) : (
        <div className="text-center space-y-3">
          <img
            src={preview}
            className="w-32 h-32 rounded-full object-cover mx-auto"
          />

          <button
            onClick={handleRetake}
            className="text-sm text-blue-600 underline"
          >
            Retake
          </button>

          <div className="flex justify-center gap-3 mt-3">
            <Button
              onClick={handleUpload}
              disabled={loading}
              className="bg-gray-600 text-white"
            >
              Upload
            </Button>
          </div>
        </div>
      )}

      {/* RESULT */}
{/* RESULT */}
{result && (
  <div className="p-4 border rounded-xl text-center">
    {result.passed ? (
      <div className="text-green-600 flex flex-col items-center">
        <CheckCircle2 />
        <p>Face matched successfully</p>
      </div>
    ) : (
      <div className="text-red-500 flex flex-col items-center">
        <XCircle />
        <p>Face mismatch</p>
      </div>
    )}

    <p className="text-xs mt-2">
      Score: {result.score} / Threshold: {result.threshold}
    </p>
  </div>
)}

{/* STEP 3 VERIFY BUTTON (ALWAYS SHOW IF SELFIE EXISTS) */}
{(existingSelfie || preview) && (
  <div className="mt-4 flex justify-center">
    <Button
      onClick={handleVerify}
      disabled={loading}
      className="bg-pink-400 text-white"
    >
      {loading ? "Verifying..." : "Run Verification"}
      <ChevronRight size={18} />
    </Button>
  </div>
)}

      {/* FOOTER */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft size={18} /> Back
        </Button>
      </div>

    </div>
  );
}