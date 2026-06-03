export default function RefundTabs({ tab, setTab, pendingCount }) {
  return (
    <div className="flex gap-6 border-b mb-6">

      <button
        onClick={() => setTab("pending")}
        className={`pb-3 text-sm ${
          tab === "pending"
            ? "border-b-2 border-pink-500 text-pink-500"
            : "text-gray-500"
        }`}
      >
        Pending ({pendingCount})
      </button>

      <button
        onClick={() => setTab("history")}
        className={`pb-3 text-sm ${
          tab === "history"
            ? "border-b-2 border-pink-500 text-pink-500"
            : "text-gray-500"
        }`}
      >
        History
      </button>

    </div>
  );
}
