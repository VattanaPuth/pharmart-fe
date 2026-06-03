"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  Users2,
  Package,
  ClipboardList,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import Banner from "../../components/dashboard/Banner";
import dashboardService from "../../services/dashboardService";
import ReviewsOverviewSection from "../../components/dashboard/ReviewsOverviewSection";
import StatsCard from "../../components/dashboard/StatCard";
import { pharmacyService } from "../../services/pharmacyService";
import reviewService from "../../services/reviewService";

// icon map
const iconMap = {
  ShieldCheck,
  Clock,
  AlertTriangle,
  Users2,
  Package,
  ClipboardList,
  TrendingUp,
  RefreshCw,
};

const formatNumber = (value, type = "number") => {
  if (type === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);
  }
  return new Intl.NumberFormat("en-US").format(value || 0);
};

const StatsCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 border border-gray-200 animate-pulse">
    <div className="w-10 h-10 bg-gray-100 rounded-xl mb-4"></div>
    <div className="h-7 w-16 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 w-24 bg-gray-100 rounded"></div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCount, setLoadingCount]= useState(true);
  const [counts, setCounts] = useState({ pending: 0 });
  const [reviewSummary, setReviewSummary] = useState(null);

  useEffect(() => {
    loadCounts();
    loadDashboard();
    loadReviews();
  }, []);

  const loadCounts = async () => {
    try {
      setLoadingCount(true)
      const data = await pharmacyService.getStatusCounts();
      setCounts(data);
      setLoadingCount(false)
    } catch (err) {
      console.error(err);
      setLoadingCount(false)
    }
  };

  const loadDashboard = async () => {
    try {
      setLoadingStats(true);

      const statsData = await dashboardService.getStats();
      setStats(statsData);

      const reviewData = await reviewService.getRatings();
      const total = reviewData.total || 0;

      const distribution = [5, 4, 3, 2, 1].reduce((acc, star) => {
        const count = reviewData.distribution?.[star] || 0;

        acc[star] = {
          count,
          percentage: total ? (count / total) * 100 : 0,
        };

        return acc;
      }, {});

      setReviewSummary({
        rating: reviewData.average,
        totalReviews: total,
        distribution,
      });

      const statusData = await pharmacyService.getStatusCounts();
      setCounts(statusData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await reviewService.getRatings();

      const total = data.total || 0;

      const distribution = [5, 4, 3, 2, 1].reduce((acc, star) => {
        const count = data.distribution?.[star] || 0;

        acc[star] = {
          count,
          percentage: total ? (count / total) * 100 : 0,
        };

        return acc;
      }, {});

      setReviewSummary({
        rating: data.average,
        totalReviews: total,
        distribution,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewClick = () => {
    // later you can navigate or set tab
    console.log("Go to pending reviews");
  };

  const statConfig = [
    {
      key: "verifiedPharmacies",
      title: "Verified Pharmacies",
      icon: "ShieldCheck",
      type: "number",
    },
    {
      key: "pendingRegistrations",
      title: "Pending Registrations",
      icon: "Clock",
      type: "number",
    },
    {
      key: "totalOrders",
      title: "Total Orders",
      icon: "Package",
      type: "number",
    },
    {
      key: "platformRevenue",
      title: "Revenue",
      icon: "TrendingUp",
      type: "currency",
    },
    {
      key: "totalRefunded",
      title: "Refunded",
      icon: "RefreshCw",
      type: "currency",
    },
    {
      key: "netRevenue",
      title: "Net Revenue",
      icon: "TrendingUp",
      type: "currency",
    },
    {
      key: "averageOrderValue",
      title: "Avg Order Value",
      icon: "ClipboardList",
      type: "currency",
    },
    {
      key: "totalPharmacies",
      title: "Total Pharmacies",
      icon: "Users2",
      type: "number",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <main className="p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>

          <div className="w-10 h-1 bg-[#F06292] rounded mt-2" />

          <p className="text-sm text-gray-500 mt-2">
            Platform overview and management
          </p>
        </div>

        {/* BANNER */}
        <div className="mb-8">
          <Banner
            loadingCount={loadingCount}
            pendingCount={(counts?.pending || 0) + (counts?.submitted || 0)}
            onReviewClick={handleReviewClick}
          />
        </div>

        {/* ERROR */}
        {/* {error && (
          <div className="bg-[#FFF1F5] border border-[#F8BBD0] rounded-xl p-6 text-center mb-6">
            <p className="text-[#AD1457]">{error}</p>

            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-[#F06292] text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        )} */}

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {loadingStats
            ? Array.from({ length: 4 }).map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))
            : statConfig.map((card, index) => {
                const IconComponent = iconMap[card.icon];
                const value = stats?.[card.key] ?? 0;

                return (
                  <StatsCard
                    key={index}
                    title={card.title}
                    value={formatNumber(value, card.type)}
                    icon={IconComponent}
                  />
                );
              })}
        </div>

        {/* REVIEWS */}

        <ReviewsOverviewSection data={reviewSummary} />
      </main>
    </div>
  );
}
