"use client";
import { useState, useEffect } from "react";
import DashboardService from "../../../services/dashboardService";

export default function useDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await DashboardService.getDashboard();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    setRefreshing(true);
    try {
      const data = await DashboardService.getDashboard();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    dashboardData,
    loading,
    refreshing,
    error,
    refetch,
  };
}
