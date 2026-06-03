import React from "react";
import { Field } from "./Field";

const ProductDescription = ({ form, set }) => {
  return (
    <Field label="Description">
      <textarea
        value={form.description || ""}
        onChange={(e) => set("description", e.target.value)}
        rows={3}
        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm resize-none"
      />
    </Field>
  );
};

export default ProductDescription;
