"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import OrdersTable from "../../components/reports/OrdersTable";
import ReportChart from "../../components/reports/ReportChart";
import StatsGrid from "../../components/reports/StatsGrid";
import TopProductsTable from "../../components/reports/TopProductTable";

import { Download } from "lucide-react";

import api from "@/lib/axios";

export default function ReportsPage() {
  const [selectedFilter, setSelectedFilter] = useState("month");

  const [startDate, setStartDate] = useState(new Date());

  const [endDate, setEndDate] = useState(new Date());

  const [loading, setLoading] = useState(true);

  const [reportData, setReportData] = useState({
    stats: {},
    breakdown: {},
    chart: [],
    top_products: [],
  });

  /*
  |--------------------------------------------------------------------------
  | FETCH REPORT
  |--------------------------------------------------------------------------
  */

  const fetchReport = async () => {
    try {
      setLoading(true);

      const params = {
        filter: selectedFilter,
      };

      if (selectedFilter === "custom") {
        params.start_date = startDate.toISOString();

        params.end_date = endDate.toISOString();
      }

      const response = await api.get("/owner/reports/dashboard", { params });

      setReportData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedFilter, startDate, endDate]);

  /*
  |--------------------------------------------------------------------------
  | FILTER BUTTON STYLE
  |--------------------------------------------------------------------------
  */

  const filterButton = (value) =>
    `px-5 py-2 rounded-xl text-sm font-medium transition-all border
    ${
      selectedFilter === value
        ? "bg-[#F06292] text-white border-[#F06292] shadow-sm"
        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
    }`;

const exportReport = async () => {
  try {
    const params = {
      filter: selectedFilter,
    };

    if (selectedFilter === "custom") {
      params.start_date = startDate.toISOString();
      params.end_date = endDate.toISOString();
    }

    const response = await api.get("/owner/reports/export", {
      params,
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = url;

    // 👇 FILE NAME HERE (frontend controlled)
    const date = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `report_${selectedFilter}_${date}.xlsx`);

    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    console.error("Export failed:", error);
  }
};

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="w-full bg-white p-6 border-b border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Reports Dashboard
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              MediCare Pharmacy ·{" "}
              <span className="text-slate-400">
                {selectedFilter === "today" && "Today's Report"}

                {selectedFilter === "7days" && "Last 7 Days"}

                {selectedFilter === "month" && "This Month"}

                {selectedFilter === "custom" && "Custom Range"}
              </span>
            </p>
          </div>

          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-sm font-medium"
          >
            <Download size={18} />
            Export Report
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setSelectedFilter("today")}
            className={filterButton("today")}
          >
            Today
          </button>

          <button
            onClick={() => setSelectedFilter("7days")}
            className={filterButton("7days")}
          >
            Last 7 Days
          </button>

          <button
            onClick={() => setSelectedFilter("month")}
            className={filterButton("month")}
          >
            This Month
          </button>

          <button
            onClick={() => setSelectedFilter("custom")}
            className={filterButton("custom")}
          >
            Custom Range
          </button>

          {selectedFilter === "custom" && (
            <div className="flex flex-wrap items-center gap-3 ml-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="border border-slate-200 rounded-xl px-4 py-2 text-sm"
                dateFormat="MMM d, yyyy"
              />

              <span className="text-slate-400 text-sm">to</span>

              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="border border-slate-200 rounded-xl px-4 py-2 text-sm"
                dateFormat="MMM d, yyyy"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}

      <StatsGrid loading={loading} stats={reportData.stats} />

      <ReportChart
        loading={loading}
        chart={reportData.chart}
        breakdown={reportData.breakdown}
      />

      <TopProductsTable loading={loading} products={reportData.top_products} />
    </div>
  );
}
