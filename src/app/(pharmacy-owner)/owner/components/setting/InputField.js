// =========================
// REUSABLE INPUT
// =========================
export function InputField({
  label,
  name,
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-pink-400"
      />
    </div>
  );
}