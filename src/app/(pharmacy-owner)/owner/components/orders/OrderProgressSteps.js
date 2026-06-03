import {
  CheckCircle,
  Circle,
} from "lucide-react";

export default function OrderProgress({ history }) {
  const steps = [
    {
      key: "confirmed_at",
      label: "Confirmed",
      date: history?.confirmed_at,
    },
    {
      key: "ready_at",
      label: "Ready",
      date: history?.ready_at,
    },
    {
      key: "pharmacy_completed_at",
      label: "Pharmacy Completed",
      date: history?.pharmacy_completed_at,
    },
    {
      key: "customer_completed_at",
      label: "Customer Completed",
      date: history?.customer_completed_at,
    },
    {
      key: "completed_at",
      label: "Completed",
      date: history?.completed_at,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const completed = !!step.date;

          return (
            <div
              key={step.key}
              className="flex flex-1 items-start"
            >
              <div className="flex flex-col items-center">
                {completed ? (
                  <CheckCircle className="h-7 w-7 text-green-600" />
                ) : (
                  <Circle className="h-7 w-7 text-gray-300" />
                )}

                <p
                  className={`mt-2 text-xs font-medium text-center ${
                    completed
                      ? "text-green-700"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>

                {step.date && (
                  <p className="mt-1 text-[10px] text-gray-500 text-center">
                    {new Date(step.date).toLocaleString(
                      "en-GB",
                      {
                        timeZone: "Asia/Phnom_Penh",
                      }
                    )}
                  </p>
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`mt-3 h-1 flex-1 mx-2 rounded ${
                    completed
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}