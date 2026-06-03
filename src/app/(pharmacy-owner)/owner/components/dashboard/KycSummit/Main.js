"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";

import { PharmacyProfileStep } from "./PharmacyProfileStep";

import DocumentUploadFormStep from "./DocumentUploadFormStep";
import { SelfieStep } from "./SelfieStep";
import { PharmacyRegistrationSuccessStep } from "./PhamarcyRegistrationSuccess";
import { ReviewStep } from "./ReviewStep";

export default function PharmacyKYC({ownerId}) {
  const [forceStep, setForceStep] = useState(null);
  const searchParams = useSearchParams();
//   const ownerId = searchParams.get("owner_id");

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------
  // FETCH PROGRESS
  // -----------------------
  const fetchProgress = async () => {
    try {
      const res = await api.get(`/owners/${ownerId}/ekyc/progress`);
      setProgress(res.data);
      setForceStep(null); // 🔥 RESET manual navigation
    } catch (err) {
      console.log("Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ownerId) fetchProgress();
  }, [ownerId]);

 

  // -----------------------
  // STEP HANDLERS
  // -----------------------
  const handleProfileNext = async (data) => {
    await api.post(`/owners/${ownerId}/ekyc/step1`, data);
    await fetchProgress();
  };

  const handleDocumentsNext = async (files) => {
    const formData = new FormData();

    Object.keys(files).forEach((key) => {
      if (files[key]) formData.append(key, files[key]);
    });

    await api.post(`/owners/${ownerId}/ekyc/step2`, formData);
    await fetchProgress();
  };

  const handleSelfieNext = async (file) => {
    const formData = new FormData();
    formData.append("selfie", file);

    await api.post(`/owners/${ownerId}/ekyc/step3`, formData);
    await fetchProgress();
  };

  const handleSubmit = async () => {
    await api.post(`/owners/${ownerId}/ekyc/step4`);
    await fetchProgress();
  };

  // -----------------------
  // LOADING STATE
  // -----------------------
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading eKYC...</div>
    );
  }

  // -----------------------
  // SUCCESS STATE
  // -----------------------
  if (progress?.submitted) {
    return <PharmacyRegistrationSuccessStep />;
  }

  // -----------------------
  // DYNAMIC FLOW (NO STEPS ARRAY)
  // -----------------------

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* STEP 1: PROFILE */}
      {(forceStep === "profile" ||
        (!progress?.profile_completed && !forceStep)) && (
        <PharmacyProfileStep onNext={handleProfileNext} ownerId={ownerId} />
      )}

      {/* STEP 2: DOCUMENTS */}
      {(forceStep === "documents" ||
        (progress?.profile_completed &&
          !progress?.documents_completed &&
          !forceStep)) && (
        <DocumentUploadFormStep
          ownerId={ownerId}
          onNext={fetchProgress}
          onBack={() => setForceStep("profile")}
        />
      )}

      {/* STEP 3: SELFIE */}
      {(forceStep === "selfie" ||
        (progress?.documents_completed &&
          !progress?.selfie_completed &&
          !forceStep)) && (
        <SelfieStep
         ownerId={ownerId} 
          onNext={handleSelfieNext}
          onBack={() => setForceStep("documents")}
        />
      )}

      {/* STEP 4: REVIEW */}
      {(forceStep === "review" ||
        (progress?.selfie_completed && !progress?.submitted && !forceStep)) && (
<ReviewStep
  onSubmit={handleSubmit}
  onBack={() => setForceStep("selfie")}
  onEdit={(step) => setForceStep(step)}
  formData={{
    profile: progress?.profile_completed,
    documents: progress?.documents_completed,
    selfie: progress?.selfie_completed,
  }}
/>
      )}
    </div>
  );
}
