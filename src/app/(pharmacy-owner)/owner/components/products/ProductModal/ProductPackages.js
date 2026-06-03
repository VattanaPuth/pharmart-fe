import React from "react";
import { PackageRow } from "./PackageRow";

const ProductPackages = ({
  mode,
  form,
  addPackage,
  updatePackage,
  removePackage,
  setDefaultPackage,
}) => {


  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">Packages</div>

        <button onClick={addPackage} className="text-pink-500 text-sm">
          + Add Package
        </button>
      </div>

      <div className="space-y-3">
        {form.packages.map((pkg, idx) => (
          <PackageRow
            key={pkg.id || idx}
            pkg={pkg}
            mode={mode}
            index={idx}
            onChange={(key, val) => updatePackage(idx, key, val)}
            onRemove={() => removePackage(idx)}
            canRemove={form.packages.length > 1}
            onSetDefault={setDefaultPackage}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductPackages;
