"use client";

import React, { useState, useRef, useEffect } from "react";

import { Camera, Upload, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "../ui/button";

import api from "@/lib/axios";

import { useSearchParams } from "next/navigation";

import toast from "react-hot-toast";
import Image from "next/image";

export function SelfieStep({ file, setFile, onSaved }) {
  const searchParams = useSearchParams();

  const ownerId = searchParams.get("owner_id");

  const [preview, setPreview] = useState(null);

  const [existingSelfie, setExistingSelfie] = useState(null);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const inputRef = useRef(null);

  // -----------------------
  // LOAD EXISTING SELFIE
  // -----------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);

        const selfieRes = await api.get(`/owners/${ownerId}/ekyc/selfie`);

        if (selfieRes.data?.selfie_url) {
          setExistingSelfie(
            `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${selfieRes.data.selfie_url}`,
          );
        }

        const resultRes = await api.get(`/owners/${ownerId}/ekyc/face-result`);

        if (resultRes.data?.score !== undefined) {
          setResult(resultRes.data);
        }
      } catch (err) {
        console.log("No selfie yet");
      } finally {
        setFetching(false);
      }
    };

    if (ownerId) {
      fetchData();
    }
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

  // -----------------------
  // REMOVE / RETAKE
  // -----------------------
  const handleRemove = () => {
    setFile(null);

    setPreview(null);
  };

  // -----------------------
  // SAVE SELFIE + VERIFY
  // -----------------------
  const handleSave = async () => {
    try {
      setLoading(true);

      // upload selfie first
      if (file instanceof File) {
        const formData = new FormData();

        formData.append("selfie", file);

        await api.post(`/owners/${ownerId}/ekyc/selfie`, formData);
      }

      // run verification
      const res = await api.post(`/owners/${ownerId}/ekyc/step3`);

      setResult(res.data.result);

      // refresh selfie
      const selfieRes = await api.get(`/owners/${ownerId}/ekyc/selfie`);

      if (selfieRes.data?.selfie_url) {
        setExistingSelfie(
          `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${selfieRes.data.selfie_url}`,
        );
      }

      // refresh parent progress
      if (onSaved) {
        await onSaved();
      }

      toast.success("Selfie verification completed");

      setFile(null);
    } catch (err) {
      console.error(err);

      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // DISPLAY IMAGE
  // -----------------------
  const displayImage = preview || existingSelfie;

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

        <p className="text-sm text-slate-500">
          Upload and verify your identity
        </p>
      </div>

      {/* SELFIE */}
      {fetching ? (
        <div className="w-44 h-44 mx-auto rounded-full bg-gray-100 animate-pulse" />
      ) : displayImage ? (
        <div className="space-y-4 text-center">
          <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden border-4 border-pink-100">
            <Image
              src={displayImage}
              alt="avatar"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex justify-center gap-3">
            {/* REPLACE */}
            <Button variant="outline" onClick={handleCapture}>
              Replace
            </Button>

            {/* REMOVE */}
            {preview && (
              <Button
                variant="ghost"
                className="text-red-500"
                onClick={handleRemove}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className="
            border-2 border-dashed
            rounded-2xl p-10
            text-center
          "
        >
          <Camera
            size={40}
            className="
              mx-auto mb-4
              text-gray-300
            "
          />

          <Button onClick={handleCapture}>
            <Upload className="mr-2" size={16} />
            Select Selfie
          </Button>
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="p-4 border rounded-xl text-center">
          {result.passed ? (
            <div
              className="
                text-green-600
                flex flex-col items-center
              "
            >
              <CheckCircle2 />

              <p>Face matched successfully</p>
            </div>
          ) : (
            <div
              className="
                text-red-500
                flex flex-col items-center
              "
            >
              <XCircle />

              <p>Face mismatch</p>
            </div>
          )}

          <p className="text-xs mt-2">
            Score: {result.score} / Threshold: {result.threshold}
          </p>
        </div>
      )}

      {/* SAVE BUTTON */}
      {displayImage && (
        <div className="pt-4">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="
              w-full bg-[#F06292]
              hover:bg-pink-600
              text-white
            "
          >
            {loading ? "Processing..." : "Save & Verify Selfie"}
          </Button>
        </div>
      )}
    </div>
  );
}
