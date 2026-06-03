import React from "react";
import { Field } from "./Field";

const ProductCategorySection = ({ form, set, categories }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Category">
        <select
          value={form.category_id || ""}
          onChange={(e) => {
            set("category_id", e.target.value);

            set("subcategory_id", "");
          }}
          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
        >
          <option value="">Select category</option>

          {categories
            .filter((c) => c.active)
            .map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </select>
      </Field>

      {/* SUBCATEGORY */}
      {/* <Field label="Subcategory">
        <select
          value={form.subcategory_id || ""}
          onChange={(e) => set("subcategory_id", e.target.value)}
          disabled={!form.category_id}
          className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm"
        >
          <option value="">No subcategory</option>

          {subcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </Field> */}
    </div>
  );
};

export default ProductCategorySection;
