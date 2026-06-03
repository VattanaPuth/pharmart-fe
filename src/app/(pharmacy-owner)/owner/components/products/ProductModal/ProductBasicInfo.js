import React from "react";
import { Field } from "./Field";
import { Input } from "./Input";
import { Select } from "./Select";

const FORM_OPTIONS = [
  "Tablet",
  "Capsule",
  "Syrup",
  "Injection",
  "Cream",
  "Drops",
  "Inhaler",
  "Patch",
  "Suppository",
  "Powder",
];

function ProductBasicInfo({ form, set }) {
  return (
    <div>
      <Field label="Product Name" required>
        <Input
          value={form.product_name}
          onChange={(e) => set("product_name", e.target.value)}
        />
      </Field>

      {/* GENERIC + STRENGTH */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Generic Name">
          <Input
            value={form.generic_name || ""}
            onChange={(e) => set("generic_name", e.target.value)}
          />
        </Field>

        <Field label="Strength">
          <Input
            value={form.strength || ""}
            onChange={(e) => set("strength", e.target.value)}
          />
        </Field>
      </div>

      {/* FORM + EXPIRY */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Form">
          <Select
            options={FORM_OPTIONS}
            placeholder="Select form"
            value={form.form}
            onChange={(e) => set("form", e.target.value)}
          />
        </Field>

        <Field label="Expiry Date">
          <Input
            type="date"
            value={form.expiry_date || ""}
            onChange={(e) => set("expiry_date", e.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}

export default ProductBasicInfo;
