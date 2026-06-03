import { TrashIcon } from "lucide-react";
import { Field } from "./Field";
import { Input } from "./Input";

// ============================================
// PACKAGE ROW
// ============================================
export const PackageRow = ({
  pkg,
  index,
  mode,
  onChange,
  onRemove,
  canRemove,
  onSetDefault,
}) => {
  // MATCH API FIELD NAME
  const isOutOfStock = Number(pkg.stock_quantity || 0) === 0;

  return (
    <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/60 space-y-3">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-xs font-bold">
            {index + 1}
          </span>
          Package {index + 1} — {pkg.package_name || "Unnamed"}
        </div>

        {canRemove && (
          <button
            onClick={onRemove}
            className="text-slate-300 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50"
          >
            <TrashIcon size={18} />
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="grid grid-cols-2 gap-3">
        {/* PACKAGE NAME */}
        <Field label="Package Name" required>
          <Input
            placeholder="Box"
            value={pkg.package_name || ""}
            onChange={(e) => onChange("package_name", e.target.value)}
          />
        </Field>

        {/* DEFAULT PACKAGE */}
        {mode == "add" ?? (
          <Field label="Default Package">
            <button
              type="button"
              onClick={() => onSetDefault(index)}
              className={`w-full px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                pkg.is_default
                  ? "bg-green-500 text-white border-green-500 ring-2 ring-green-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-green-400"
              }`}
            >
              {pkg.is_default ? "✓ Default Package" : "Set as Default"}
            </button>
          </Field>
        )}

        {/* CONTAINS */}
        <Field label="Contains">
          <Input
            placeholder="e.g. 30 tablets per box"
            value={pkg.contains || ""}
            onChange={(e) => onChange("contains", e.target.value)}
          />
        </Field>

        {/* PRICE */}
        <Field label="Price (USD)" required>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
              $
            </span>

            <Input
              className="pl-7"
              type="number"
              min="0"
              step="0.01"
              value={pkg.price || 0}
              onChange={(e) => {
                const val = e.target.value;

                if (val === "") {
                  onChange("price", "");
                  return;
                }

                onChange("price", parseFloat(val));
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  onChange("price", 0);
                }
              }}
            />
          </div>
        </Field>

        {/* STOCK */}
        <Field label="Stock Quantity" required>
          <Input
            type="number"
            min="0"
            value={pkg.stock_quantity ?? ""}
            onChange={(e) => {
              const val = e.target.value;

              if (val === "") {
                onChange("stock_quantity", "");
                return;
              }

              onChange("stock_quantity", parseInt(val));
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                onChange("stock_quantity", 0);
              }
            }}
          />
        </Field>
      </div>

      {/* LOW STOCK */}
      <Field label="Low Stock Alert — notify when stock reaches">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              type="number"
              min="0"
              value={pkg.low_stock_threshold || 0}
              onChange={(e) => {
                const val = e.target.value;

                if (val === "") {
                  onChange("low_stock_threshold", "");
                  return;
                }

                onChange("low_stock_threshold", parseInt(val));
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  onChange("low_stock_threshold", 0);
                }
              }}
            />

            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              units remaining
            </span>
          </div>

          {isOutOfStock && (
            <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-lg whitespace-nowrap">
              Out of stock
            </span>
          )}
        </div>
      </Field>

      {/* FOOTER */}
      <div className="text-xs text-slate-400 pt-1 border-t border-slate-100">
        {pkg.package_name || "Package"} —{" "}
        {pkg.contains || "e.g. 30 tablets per box"}
      </div>
    </div>
  );
};
