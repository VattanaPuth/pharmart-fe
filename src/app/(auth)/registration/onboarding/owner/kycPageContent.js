"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

import { PharmacyProfileStep } from "@/components/LoginAndRegistration/PharmacyProfileStep";
import DocumentUploadFormStep from "@/components/LoginAndRegistration/DocumentUploadFormStep";
import { SelfieStep } from "@/components/LoginAndRegistration/SelfieStep";
import { PharmacyRegistrationSuccessStep } from "@/components/LoginAndRegistration/PhamarcyRegistrationSuccess";
import { ReviewStep } from "@/components/LoginAndRegistration/ReviewStep";

export default function PharmacyKYCContent() {
  const searchParams = useSearchParams();
  const ownerId = searchParams.get("owner_id");
  const validOwnerId = ownerId && ownerId !== "undefined" && ownerId !== "null";

  const router = useRouter();

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const initializedProgress = useRef(false);

  // ---------------- TABS ----------------
  const tabs = ["profile", "documents", "selfie", "review"];

  const [activeTab, setActiveTab] = useState("profile");

  // ---------------- FORM STATES ----------------
  const [profileForm, setProfileForm] = useState({
    owner_name: "",
    pharmacy_name: "",
    date_of_birth: "",
    full_address: "",
    city: "",
    phone_number: "",
    email: "",
  });

  const [documentsForm, setDocumentsForm] = useState({});

  const [selfieFile, setSelfieFile] = useState(null);

  // ---------------- FETCH ----------------
  const fetchProgress = useCallback(async () => {
    if (!validOwnerId) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(
        `/owners/${ownerId}/ekyc/progress`
      );

      setProgress(res.data);

      // only auto set first time
      if (!initializedProgress.current) {
        if (!res.data.profile_completed) {
          setActiveTab("profile");
        } else if (!res.data.documents_completed) {
          setActiveTab("documents");
        } else if (!res.data.selfie_completed) {
          setActiveTab("selfie");
        } else {
          setActiveTab("review");
        }

        initializedProgress.current = true;
      }
    } catch (err) {
      console.log("Failed to load progress");
    } finally {
      setLoading(false);
    }
  }, [ownerId, validOwnerId]);

  useEffect(() => {
    const recoverOwnerId = async () => {
      if (validOwnerId) {
        fetchProgress();
        return;
      }

      try {
        const res = await api.get("/get_user_info");
        const recoveredOwnerId = res.data?.owner?.id;

        if (recoveredOwnerId) {
          router.replace(`/registration/onboarding/owner?owner_id=${recoveredOwnerId}`);
          return;
        }
      } catch {
        // fall through to login
      }

      router.replace("/login");
    };

    recoverOwnerId();
  }, [fetchProgress, router, validOwnerId]);

  // ---------------- FINAL SUBMIT ----------------
  const handleSubmit = async () => {
    if (!validOwnerId) {
      return;
    }

    try {
      const res = await api.post(
        `/owners/${ownerId}/ekyc/step4`
      );

      localStorage.setItem("token", res.data.token);

      document.cookie = `token=${res.data.token}; path=/`;

      router.replace("/owner/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- NAVIGATION ----------------
  const currentIndex = tabs.indexOf(activeTab);

  const goNext = () => {
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];

      if (isTabEnabled(nextTab)) {
        setActiveTab(nextTab);
      }
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const isTabEnabled = (tab) => {
    switch (tab) {
      case "profile":
        return true;

      case "documents":
        return progress?.profile_completed;

      case "selfie":
        return progress?.documents_completed;

      case "review":
        return progress?.selfie_completed;

      default:
        return false;
    }
  };

  // ---------------- LOADING ----------------
if (loading) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-200 rounded" />

      <div className="flex gap-2">
        <div className="h-10 w-24 bg-gray-200 rounded" />
        <div className="h-10 w-24 bg-gray-200 rounded" />
        <div className="h-10 w-24 bg-gray-200 rounded" />
      </div>

      <div className="bg-gray-200 h-64 rounded-2xl" />
      <div className="bg-gray-200 h-64 rounded-2xl" />
    </div>
  );
}

  // ---------------- SUCCESS ----------------
  if (progress?.submitted) {
    return <PharmacyRegistrationSuccessStep />;
  }

  // ---------------- RENDER STEP ----------------
  const renderStep = () => {
    switch (activeTab) {
      case "profile":
        return (
          <PharmacyProfileStep
            form={profileForm}
            setForm={setProfileForm}
            onSaved={fetchProgress}
          />
        );

      case "documents":
        return (
          <DocumentUploadFormStep
            files={documentsForm}
            setFiles={setDocumentsForm}
            onSaved={fetchProgress}
          />
        );

      case "selfie":
        return (
          <SelfieStep
            file={selfieFile}
            setFile={setSelfieFile}
            onSaved={fetchProgress}
          />
        );

      case "review":
        return (
          <ReviewStep
            onSubmit={handleSubmit}
            formData={{
              profile: progress?.profile_completed,
              documents: progress?.documents_completed,
              selfie: progress?.selfie_completed,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto p-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab, index) => {
          const enabled = isTabEnabled(tab);

          return (
            <button
              key={tab}
              disabled={!enabled}
              onClick={() => setActiveTab(tab)}
              className={`
                px-5 py-3 rounded-xl capitalize font-medium transition
                ${
                  activeTab === tab
                    ? "bg-[#F06292] text-white"
                    : enabled
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {index + 1}. {tab}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow p-6">
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={goBack}
            disabled={currentIndex === 0}
            className="
              px-5 py-2 rounded-lg border
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Back
          </button>

          {activeTab !== "review" && (
            <button
              onClick={goNext}
              disabled={
                !isTabEnabled(tabs[currentIndex + 1])
              }
              className="
                px-5 py-2 rounded-lg
                bg-[#F06292] text-white
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
