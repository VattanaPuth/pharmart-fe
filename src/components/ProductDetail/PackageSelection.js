import { CheckCircle2 } from "lucide-react";

export default function PackageSelection({
  product,
  selectedPackage,
  setSelectedPackage,
}) {
  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-base font-md text-slate-800">Select Package</h3>

      {product.packages?.map((pkg) => {
        const outOfStock = pkg.stock_quantity <= 0;

        return (
          <button
            key={pkg.id}
            disabled={outOfStock}
            onClick={() => !outOfStock && setSelectedPackage(pkg)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
              outOfStock
                ? "border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed"
                : selectedPackage?.id === pkg.id
                  ? "border-[#F06292] bg-[#FCE4EC]"
                  : "border-slate-100 bg-white hover:border-slate-200"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-800">
                  {pkg.package_name}
                </span>

                {selectedPackage?.id === pkg.id && !outOfStock && (
                  <CheckCircle2 size={16} className="text-[#F06292]" />
                )}

                {outOfStock && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-500 font-semibold">
                    Out of stock
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mb-1">{pkg.contains}</p>

              <p className="text-[10px] text-slate-400 font-medium italic">
                In stock: {pkg.stock_quantity}
              </p>
            </div>

            <span className="text-lg font-bold text-slate-800">
              ${Number(pkg.price).toFixed(2)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
