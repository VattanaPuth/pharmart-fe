import { Plus, Minus } from "lucide-react";

export default function QuantityInput({
  quantityInput,
  setQuantityInput,
  updateQuantity,
  total,
  quantity,
  setQuantity,
  selectedPackage,
}) {
  return (
    <div className="flex items-center gap-6 mb-8">
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-slate-800">Quantity:</span>

        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
          <button
            disabled={quantity <= 1}
            onClick={() => updateQuantity(quantity - 1)}
            className={`p-2 ${
              quantity <= 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-slate-200"
            }`}
          >
            <Minus size={16} />
          </button>

          <input
            value={quantityInput}
            onChange={(e) => {
              const val = e.target.value;

              if (val === "") {
                setQuantityInput("");
                return;
              }

              if (!/^\d+$/.test(val)) return;

              updateQuantity(Number(val));
            }}
            onBlur={() => {
              if (!quantityInput || Number(quantityInput) < 1) {
                updateQuantity(1);
              }
            }}
            className="w-12 text-center bg-transparent"
          />

          <button
            disabled={
              quantity >= 10 || quantity >= selectedPackage?.stock_quantity
            }
            onClick={() => updateQuantity(quantity + 1)}
            className={`p-2 ${
              quantity >= 10 || quantity >= selectedPackage?.stock_quantity
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-slate-200"
            }`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <p className="text-slate-400 font-medium">
        Total: <span className="text-slate-800 font-bold">${total}</span>
      </p>
    </div>
  );
}
