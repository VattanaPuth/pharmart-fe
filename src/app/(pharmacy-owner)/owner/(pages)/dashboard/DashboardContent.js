"use client";
import CardDashboard from "../../components/dashboard/CardDashboard";
import RevenueCard from "../../components/dashboard/RevenueCard";
import DashboardAlerts from "../../components/dashboard/DashboardAlerts";
import RecentOrders from "../../components/dashboard/RecentOrders";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import PharmacyKYC from "../../components/dashboard/KycSummit2/Main";
import Link from "next/link";
import api from "@/lib/axios";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
export default function DashboardContent() {
  const { profile, owner, loading, refreshAuth } = useAuth();
  const [authRefreshed, setAuthRefreshed] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [reviewSummary, setReviewSummary] = useState({
    average_rating: 0,
    total_review_orders: 0,
  });

  const [reviewLoading, setReviewLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setDashboardLoading(true);

        const response = await api.get("/owner/dashboard/full");

        setDashboard(response.data);

        // optional: keep old review format
        setReviewSummary(
          response.data.reviews_summary || {
            average_rating: 0,
            total_review_orders: 0,
          },
        );
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      } finally {
        setDashboardLoading(false);
      }
    };

    if (profile?.status === "approved") {
      fetchDashboard();
    }
  }, [profile]);

  useEffect(() => {
    if (searchParams.get("error") === "ekyc_unapproved") {
      toast.error(
        (t) => (
          <div className="flex flex-col gap-2">
            <p className="font-medium">
              Please wait for eKYC approval to access other features.
            </p>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="mt-2 self-end bg-red-500 text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              OK
            </button>
          </div>
        ),
        {
          duration: Infinity, // Keeps the toast open until "OK" is clicked
          position: "top-center",
          style: {
            minWidth: "350px",
          },
        },
      );

      // Remove the error param from URL without reloading
      router.replace("/owner/dashboard");
    }
  }, [searchParams, router]);

  const handleRefreshAuth = async () => {
    try {
      setRefreshing(true);
      await refreshAuth();
      toast.success("Auth refreshed");
    } catch (err) {
      toast.error("Failed to refresh auth");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading || profile === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (profile && profile?.status !== "approved") {
    console.log("owner id for ekyc:", owner?.id);
    return <PharmacyKYC ownerId={owner?.id} />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex flex-col gap-4 p-4 md:flex-row md:justify-between md:items-center">
        {/* TITLE */}
        <div>
          <h1 className="text-xl text-black">Seller Dashboard</h1>
          <p className="text-gray-400 text-sm">MediCare Pharmacy</p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          {/* REFRESH */}
          <button
            onClick={handleRefreshAuth}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-full border bg-white hover:bg-gray-50 text-sm"
          >
            <RefreshCcw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          {/* RATING */}
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 min-h-10 whitespace-nowrap">
            <div className="text-yellow-500">★</div>

            {dashboardLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-8 bg-orange-200 rounded animate-pulse"></div>
                <div className="h-4 w-6 bg-orange-100 rounded animate-pulse"></div>
              </div>
            ) : (
              <div className="text-orange-700 font-semibold text-sm md:text-base">
                {reviewSummary.average_rating || 0}
                <span className="text-orange-500">
                  {" "}
                  ({reviewSummary.total_review_orders || 0})
                </span>
              </div>
            )}
          </div>

          {/* CREATE PRODUCT */}
          <Link
            href={"/owner/products"}
            className="flex items-center gap-2 bg-pink-500 text-white px-5 py-2 rounded-full text-sm"
          >
            <Plus className="w-5 h-5" />
            Create Product
          </Link>
        </div>
      </div>

      <CardDashboard data={dashboard?.summary} />
      <RevenueCard data={dashboard?.revenue} />
      <DashboardAlerts data={dashboard?.inventory_alerts} pending_orders={dashboard?.pending_orders} low_stock_products={dashboard?.low_stock.data} near_expiry_products={dashboard?.near_expiry.data} />
      <RecentOrders data={dashboard?.recent_orders} />
    </div>
  );
}
