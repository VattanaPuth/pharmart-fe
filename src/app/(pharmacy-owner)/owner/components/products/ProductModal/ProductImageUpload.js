import React from "react";
import { Field } from "./Field";
import { Upload } from "lucide-react";
import { getStorageUrl } from "@/lib/media";

const ProductImageUpload = ({form,handleImageDrop ,fileInputRef}) => {


  return (
    <Field label="Main Image">
      <div
        className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer"
        onDrop={handleImageDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        {form.imagePreview ? (
          <img
            src={getStorageUrl(form.imagePreview)}
            alt="preview"
            className="w-20 h-20 object-cover rounded-xl mx-auto"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Upload size={24} />

            <span className="text-sm">Click to upload image</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageDrop}
        />
      </div>
    </Field>
  );
};

export default ProductImageUpload;
