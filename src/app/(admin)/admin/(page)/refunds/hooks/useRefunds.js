"use client";

import { useState } from "react";
import { refundService } from "../../../services/refundService";

export default function useRefunds() {
  const [refunds, setRefunds] = useState(refundService.getRefunds());
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tab, setTab] = useState("pending");

  const openRefund = (refund) => {
    setSelectedRefund(refund);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setSelectedRefund(null);
    setIsDrawerOpen(false);
  };

  const processRefund = () => {
    if (!selectedRefund) return;

    setRefunds((prev) =>
      prev.map((r) =>
        r.id === selectedRefund.id
          ? { ...r, status: "processed", date: "Feb 24, 2026" }
          : r
      )
    );

    closeDrawer();
    setTab("history"); // switch to history automatically
  };

  const pending = refunds.filter((r) => r.status === "pending");
  const history = refunds.filter((r) => r.status === "processed");

  return {
    pending,
    history,
    tab,
    setTab,
    openRefund,
    processRefund,
    selectedRefund,
    isDrawerOpen,
    closeDrawer,
  };
}
