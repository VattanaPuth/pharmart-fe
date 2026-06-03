import React from "react";
import { MdCheck } from "react-icons/md";
import { HiOutlineClock } from "react-icons/hi";
import { FiPackage } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";
import { LuStore } from "react-icons/lu";

// const normalizeStatus = (status) => {
//   if (!status) return "";

//   const map = {
//     pending: "Pending",
//     confirmed: "Confirmed",
//     ready: "Ready",
//     delivering: "Delivering",
//     completed: "Completed",
//     cancelled: "Cancelled",
//     declined: "Declined",
//   };

//   return map[status.toLowerCase()] || status;
// };

const ProgressStep = ({
  orderFulfillmentType,
  orderStatus,
  statusHistory = [],
}) => {
  const normalizedStatus = orderStatus?.toLowerCase();

  const isCancelled =
    normalizedStatus === "Cancelled" || normalizedStatus === "Declined";

  const steps =
    orderFulfillmentType === "Delivery"
      ? [
          { label: "Pending", icon: HiOutlineClock },
          { label: "Confirmed", icon: MdCheck },
          { label: "Delivering", icon: TbTruckDelivery },
          { label: "Completed", icon: FiPackage },
        ]
      : [
          { label: "Pending", icon: HiOutlineClock },
          { label: "Confirmed", icon: MdCheck },
          { label: "Ready", icon: LuStore },
          { label: "Completed", icon: FiPackage },
        ];

  const currentStepIndex = steps.findIndex(
    (step) => step.label.toLowerCase() === normalizedStatus,
  );

  const safeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  // 🔥 get time for each step
const getTime = (label) => {
  const found = statusHistory.find(
    (s) => s.status?.toLowerCase() === label.toLowerCase()
  );
  return found ? found.time : null;
};

  return (
    <div className="w-full px-4 py-6">
      {isCancelled ? (
        <div className="text-center text-red-500 font-semibold">
          Order {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
        </div>
      ) : (
        <div className="relative flex justify-between items-start">
          {/* Background line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />

          {/* Progress fill */}
          <div
            className="absolute top-5 left-0 h-1 bg-[#f06292] rounded-full transition-all duration-500"
            style={{
              width: `${(safeIndex / (steps.length - 1)) * 100}%`,
            }}
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < safeIndex;
            const isCurrent = index === safeIndex;

            const time = getTime(step.label);

            return (
              <div
                key={step.label}
                className="relative z-10 flex flex-col items-center w-1/4 text-center"
              >
                {/* circle */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2
                    ${
                      isCompleted
                        ? "bg-[#f06292] border-[#f06292] text-white"
                        : isCurrent
                          ? "bg-white border-[#f06292] text-[#f06292]"
                          : "bg-white border-gray-300 text-gray-400"
                    }`}
                >
                  {isCompleted ? <MdCheck size={18} /> : <Icon size={18} />}
                </div>

                {/* label */}
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCompleted || isCurrent
                      ? "text-[#f06292]"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>

                {/* 🔥 time */}
                {time && (
                  <span className="text-[10px] text-gray-400 mt-1">
                    {new Date(time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProgressStep;
