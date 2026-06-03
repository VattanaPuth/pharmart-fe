"use client";
import React from "react";
import StatsCard from "../StatCard";

export default function StatsSection({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatsCard title="Verified Pharmacies" value={stats.verifiedPharmacies || 0} />
      <StatsCard title="Pending Registrations" value={stats.pendingRegistrations || 0} />
      <StatsCard title="Total Orders" value={stats.totalOrders || 0} />
      <StatsCard title="Platform Revenue" value={`$${stats.platformRevenue || 0}`} />
    </div>
  );
}
