import { Suspense } from "react";

import PharmacyKYCContent from "./kycPageContent";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PharmacyKYCContent />
    </Suspense>
  );
}