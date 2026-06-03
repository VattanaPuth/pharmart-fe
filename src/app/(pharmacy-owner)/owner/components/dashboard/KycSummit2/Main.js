"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";

import { PharmacyProfileStep } from "./PharmacyProfileStep";
import DocumentUploadFormStep from "./DocumentUploadFormStep";
import { SelfieStep } from "./SelfieStep";
import { PharmacyRegistrationSuccessStep } from "./PhamarcyRegistrationSuccess";
import { ReviewStep } from "./ReviewStep";
import RenderStatus from "./RenderStatus";




export default function PharmacyKYC({ ownerId }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
   const [statusData, setStatusData] = useState(null);

  // 👇 THIS FIXES YOUR TAB ISSUE
  const [activeStep, setActiveStep] = useState("profile");

  const steps = [
    { key: "profile", label: "Profile" },
    { key: "documents", label: "Documents" },
    { key: "selfie", label: "Selfie" },
    { key: "review", label: "Review" },
  ];

  // =======================
  // FETCH PROGRESS
  // =======================
  const fetchProgress = async () => {
    try {
      const res = await api.get(`/owners/${ownerId}/ekyc/progress`);
      setProgress(res.data);
    } catch (err) {
      console.log("Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await api.get(`/owners/${ownerId}/ekyc/review-status`);
      setStatusData(res.data);
    } catch (err) {
      console.log("Failed to load progress");
    } finally {
     
    }
  };

  useEffect(() => {
    if (ownerId) {
      fetchProgress();
      fetchStatus();
    }

    
  }, [ownerId]);

  // =======================
  // ACCESS CONTROL
  // =======================
  const canAccessStep = (stepKey) => {
    if (!progress) return false;

    const completed = {
      profile: progress?.profile_completed,
      documents: progress?.documents_completed,
      selfie: progress?.selfie_completed,
    };

    if (stepKey === "profile") return true;
    if (stepKey === "documents") return completed.profile;
    if (stepKey === "selfie") return completed.documents;
    if (stepKey === "review") return completed.selfie;
  };

  // =======================
  // AUTO STEP SYNC (IMPORTANT)
  // =======================
  useEffect(() => {
    if (!progress) return;

    if (!progress.profile_completed) setActiveStep("profile");
    else if (!progress.documents_completed) setActiveStep("documents");
    else if (!progress.selfie_completed) setActiveStep("selfie");
    else setActiveStep("review");
  }, [progress]);

  // =======================
  // HANDLERS
  // =======================
  const handleProfileNext = async (data) => {
    await api.post(`/owners/${ownerId}/ekyc/step1`, data);
    await fetchProgress();
  };

  const handleDocumentsNext = async () => {
    await fetchProgress();
  };

  const handleSelfieNext = async () => {
    await fetchProgress();
  };

  const handleSubmit = async () => {
    await api.post(`/owners/${ownerId}/ekyc/step4`);
    await fetchProgress();
  };

  // =======================
  // LOADING
  // =======================
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading eKYC...
      </div>
    );
  }

  // =======================
  // SUCCESS
  // =======================
  if (progress?.submitted) {
    return <PharmacyRegistrationSuccessStep />;
  }




  return (
    <div className=" p-6">

<RenderStatus statusData={statusData}/>

      {/* =======================
          TABS (NOW WORKING)
      ======================= */}
      <div className="flex gap-2 mb-6 border-b pb-2">
        {steps.map((step) => {
          const active = activeStep === step.key;
          const allowed = canAccessStep(step.key);

          return (
            <button
              key={step.key}
              onClick={() => allowed && setActiveStep(step.key)}
              disabled={!allowed}
              className={`px-4 py-2 text-sm rounded-t-md transition
                ${
                  active
                    ? "bg-pink-500 text-white"
                    : allowed
                    ? "text-gray-700 hover:bg-pink-50"
                    : "text-gray-300 cursor-not-allowed"
                }`}
            >
              {step.label}
            </button>
          );
        })}
      </div>

      {/* =======================
          STEP CONTENT
      ======================= */}

      {activeStep === "profile" && (
        <PharmacyProfileStep
          onNext={handleProfileNext}
          ownerId={ownerId}
        />
      )}

      {activeStep === "documents" && (
        <DocumentUploadFormStep
          ownerId={ownerId}
          onNext={handleDocumentsNext}
          onBack={() => setActiveStep("profile")}
        />
      )}

      {activeStep === "selfie" && (
        <SelfieStep
          ownerId={ownerId}
          onNext={handleSelfieNext}
          onBack={() => setActiveStep("documents")}
        />
      )}

      {activeStep === "review" && (
        <ReviewStep
          onSubmit={handleSubmit}
          onBack={() => setActiveStep("selfie")}
          onEdit={(step) => setActiveStep(step)}
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



