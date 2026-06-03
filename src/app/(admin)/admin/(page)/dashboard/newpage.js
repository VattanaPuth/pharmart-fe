"use client";

import useDashboard from "./hooks/useDashboard";
import StatsSection from "../../components/dashboard/components/StatsSection";
import PendingKYCSection from "../../components/dashboard/PendingKYCSection";
import RecentOrdersSection from "../../components/dashboard/RecentOrdersSection";
import ReviewsOverviewSection from "../../components/dashboard/ReviewsOverviewSection";

export default function DashboardPage() {
  const { data, loading, error } = useDashboard();

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-8">

      <StatsSection stats={data.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingKYCSection data={data.pendingKYC} />
        <RecentOrdersSection data={data.recentOrders} />
      </div>

      <ReviewsOverviewSection data={data.reviewsOverview} />

    </div>
  );
}
