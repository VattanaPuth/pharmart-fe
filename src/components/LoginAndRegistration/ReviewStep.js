import {
  CheckCircle2,
  ChevronLeft,
  Store,
  FileText,
  Camera,
} from "lucide-react";

export function ReviewStep({
  onBack,
  onEdit,
  onSubmit,
  formData = {},
  loading = false,
}) {
  const sections = [
    {
      id: "profile",
      title: "Pharmacy Profile",
      detail: formData?.profile ? "Profile completed" : "Not completed",
      icon: Store,
      done: !!formData?.profile,
    },
    {
      id: "documents",
      title: "Required Documents",
      detail: formData?.documents ? "Documents uploaded" : "Documents missing",
      icon: FileText,
      done: !!formData?.documents,
    },
    {
      id: "selfie",
      title: "Selfie Verification",
      detail: formData?.selfie ? "Selfie verified" : "Missing selfie",
      icon: Camera,
      done: !!formData?.selfie,
    },
  ];

  const canSubmit = sections.every((s) => s.done);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Review Your Application
        </h2>
        <p className="text-xs text-slate-400">
          Confirm all details before submitting
        </p>
      </div>

      {/* SECTIONS */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.id}
            className="flex items-center justify-between p-4 bg-slate-50 border rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-xl ${
                  section.done
                    ? "bg-green-100 text-green-600"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                <section.icon size={20} />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  {section.title}
                </h4>
                <p className="text-xs text-slate-500">{section.detail}</p>
              </div>
            </div>

            <button
              onClick={() => onEdit?.(section.id)}
              className="text-[#F06292] text-xs font-bold hover:underline"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* TERMS */}
      <div className="bg-pink-50 border border-pink-100 p-5 rounded-2xl">
        <h4 className="text-sm font-bold text-slate-800 mb-2">
          Before submitting:
        </h4>

        <ul className="text-xs text-slate-600 space-y-1">
          <li>• Information must be accurate</li>
          <li>• Documents must be valid</li>
          <li>• You agree to terms & conditions</li>
        </ul>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 border rounded-xl text-slate-500 font-bold"
        >
          <ChevronLeft className="inline mr-1" size={18} />
          Back
        </button>

        <button
          onClick={onSubmit}
          disabled={!canSubmit || loading}
          className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${
            canSubmit && !loading
              ? "bg-[#F06292] hover:bg-pink-600"
              : "bg-pink-200 cursor-not-allowed"
          }`}
        >
          {loading ? "Submitting..." : "Submit eKYC Application"}
        </button>
      </div>
    </div>
  );
}
