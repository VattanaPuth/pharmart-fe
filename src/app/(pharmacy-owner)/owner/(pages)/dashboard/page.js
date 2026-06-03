import { Suspense } from "react";
import DashboardContent from "./DashboardContent";


export default function OwnerDashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}