import { Suspense } from "react";
import CheckoutPageContent from "./CheckoutContent";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}