import { CheckCircle2, XCircle, Clock3, Ban } from "lucide-react";

export default function RenderStatus({ statusData }) {
  const status = statusData?.status;

  // ======================
  // APPROVED
  // ======================
  if (status === "approved") {
    return (
      <div className="mb-6 border border-green-200 bg-green-50 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="text-green-600 mt-0.5" />

          <div>
            <h3 className="font-semibold text-green-700">eKYC Approved</h3>

            <p className="text-sm text-green-600 mt-1">
              Your pharmacy verification has been approved.
            </p>

            {statusData?.reviewed_at && (
              <p className="text-xs text-green-500 mt-2">
                Reviewed at: {new Date(statusData.reviewed_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ======================
  // REJECTED
  // ======================
  if (status === "rejected") {
    return (
      <div className="mb-6 border border-red-200 bg-red-50 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <XCircle className="text-red-600 mt-0.5" />

          <div className="flex-1">
            <h3 className="font-semibold text-red-700">eKYC Rejected</h3>

            <p className="text-sm text-red-600 mt-1">
              Your verification was rejected by admin.
            </p>

            {statusData?.review_message && (
              <div className="mt-3 p-3 ">
                <p className="text-xs text-gray-500 mb-1">Review Message</p>

                <p className="text-sm text-gray-700">
                  {statusData.review_message}
                </p>
              </div>
            )}

            {statusData?.reviewed_at && (
              <p className="text-xs text-red-500 mt-3">
                Reviewed at: {new Date(statusData.reviewed_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ======================
  // SUSPENDED
  // ======================
  if (status === "suspended") {
    return (
      <div className="mb-6 border border-orange-200 bg-orange-50 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Ban className="text-orange-600 mt-0.5" />

          <div className="flex-1">
            <h3 className="font-semibold text-orange-700">Account Suspended</h3>

            <p className="text-sm text-orange-600 mt-1">
              Your pharmacy account has been suspended.
            </p>

            {statusData?.review_message && (
              <div className="mt-3 p-3 rounded-xl ">
                <p className="text-xs text-gray-500 mb-1">Suspension Reason</p>

                <p className="text-sm text-gray-700">
                  {statusData.review_message}
                </p>
              </div>
            )}

            {statusData?.reviewed_at && (
              <p className="text-xs text-orange-500 mt-3">
                Suspended at:{" "}
                {new Date(statusData.reviewed_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ======================
  // PENDING
  // ======================
  if (status === "pending_review") {
    return (
      <div className="mb-6 border border-yellow-200 bg-yellow-50 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Clock3 className="text-yellow-600 mt-0.5" />

          <div>
            <h3 className="font-semibold text-yellow-700">Under Review</h3>

            <p className="text-sm text-yellow-700 mt-1">
              Your eKYC submission is currently under review.
            </p>

            {statusData?.submitted_at && (
              <p className="text-xs text-yellow-600 mt-2">
                Submitted at:{" "}
                {new Date(statusData.submitted_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === "submitted") {
    return (
      <div className="mb-6 border border-blue-200 bg-blue-50 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Clock3 className="text-blue-600 mt-0.5" />

          <div>
            <h3 className="font-semibold text-blue-700">Submitted</h3>

            <p className="text-sm text-blue-700 mt-1">
              Your eKYC has been submitted successfully and is waiting to enter
              review queue.
            </p>

            {statusData?.submitted_at && (
              <p className="text-xs text-blue-600 mt-2">
                Submitted at:{" "}
                {new Date(statusData.submitted_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
