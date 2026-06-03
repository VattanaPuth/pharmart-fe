import React from "react";
import { X } from "lucide-react";

export default function ActionModal({
  isOpen,
  type, // "approve" | "reject" | "suspend"
  message,
  onMessageChange,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !type) return null;

  const config = {
    approve: {
      title: "Approve pharmacy",
      description: "This pharmacy will be activated and can operate normally.",
      button: "Approve",
      color: "bg-green-600 hover:bg-green-700",
      ring: "focus:ring-green-500",
    },
    reject: {
      title: "Reject pharmacy",
      description: "Please provide a reason for rejecting this pharmacy.",
      button: "Reject",
      color: "bg-red-600 hover:bg-red-700",
      ring: "focus:ring-red-500",
    },
    suspend: {
      title: "Suspend pharmacy",
      description: "This pharmacy will be temporarily disabled.",
      button: "Suspend",
      color: "bg-gray-700 hover:bg-gray-800",
      ring: "focus:ring-gray-500",
    },
  };

  const cfg = config[type];

  if (!cfg) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">{cfg.title}</h3>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-3">
          <p className="text-sm text-gray-700">{cfg.description}</p>

          {/* message optional but useful for audit */}
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 ${cfg.ring} resize-none min-h-24`}
            placeholder="Enter message (optional)..."
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition ${cfg.color}`}
          >
            {cfg.button}
          </button>
        </div>
      </div>
    </div>
  );
}