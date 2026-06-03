import { Suspense } from "react";
import ProductsPageContent from "./ProductPageContent";


export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}