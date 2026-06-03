import { Suspense } from "react";
import BrowseProducts from "./ProductsPageContent";

export default function BrowseProductsPage(){
  return (
    <Suspense fallback={<div>Loading Product</div>}>
      <BrowseProducts/>
    </Suspense>
  )
}