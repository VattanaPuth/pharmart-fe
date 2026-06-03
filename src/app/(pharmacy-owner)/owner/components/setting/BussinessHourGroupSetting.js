export function BusinessHourGroup({
  label,
  data,
  onUpdate,
}) {
  const first = data[0] || {};

  return (
    <div className="rounded-2xl border border-gray-100 p-4">
      
      {/* HEADER ROW */}
      <div className="flex items-center justify-between mb-3 md:hidden">
        <span className="text-sm font-semibold text-gray-700">
          {label}
        </span>

        {/* TOGGLE (mobile top-right) */}
        <button
          onClick={() =>
            onUpdate("is_open", !first.is_open)
          }
          className={`relative h-6 w-10 rounded-full transition ${
            first.is_open ? "bg-pink-500" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
              first.is_open ? "left-5" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* DESKTOP LABEL + TOGGLE */}
      <div className="hidden md:flex items-center gap-3 mb-3">
        <span className="text-sm font-semibold text-gray-700 w-22.5">
          {label}
        </span>

        <button
          onClick={() =>
            onUpdate("is_open", !first.is_open)
          }
          className={`relative h-6 w-10 rounded-full transition ${
            first.is_open ? "bg-pink-500" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
              first.is_open ? "left-5" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* TIME INPUTS */}
      <div className="flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] gap-3 items-center">

        {/* OPEN */}
        <input
          type="time"
          value={first.open_time || ""}
          disabled={!first.is_open}
          onChange={(e) =>
            onUpdate("open_time", e.target.value)
          }
          className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none disabled:bg-gray-100"
        />

        {/* TO LABEL */}
        <span className="text-xs text-gray-400 text-center">
          to
        </span>

        {/* CLOSE */}
        <input
          type="time"
          value={first.close_time || ""}
          disabled={!first.is_open}
          onChange={(e) =>
            onUpdate("close_time", e.target.value)
          }
          className="w-full h-11 rounded-xl border border-gray-200 px-4 text-sm outline-none disabled:bg-gray-100"
        />
      </div>
    </div>
  );
}