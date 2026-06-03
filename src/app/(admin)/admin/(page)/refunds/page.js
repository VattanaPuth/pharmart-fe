"use client";



import RefundStats from "../../components/refunds/components/RefundStats";
import RefundTable from "../../components/refunds/components/RefundTable";
import RefundHistoryTable from "../../components/refunds/components/RefundHistoryTable";
import RefundTabs from "../../components/refunds/components/RefundTabs";
import RefundDrawer from "../../components/refunds/components/RefundDrawer";

import useRefunds from "./hooks/useRefunds";

export default function RefundsPage() {
  const {
    pending,
    history,
    tab,
    setTab,
    openRefund,
    processRefund,
    selectedRefund,
    isDrawerOpen,
    closeDrawer,
  } = useRefunds();

  return (
    <div className="min-h-screen bg-gray-50">
   

      <main className="p-8">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Refund Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review seller-approved refunds and trigger Stripe payouts.
          </p>
        </div>

        <RefundStats />

        <RefundTabs
          tab={tab}
          setTab={setTab}
          pendingCount={pending.length}
        />

        {tab === "pending" && (
          <RefundTable refunds={pending} onProcess={openRefund} />
        )}

        {tab === "history" && (
          <RefundHistoryTable refunds={history} />
        )}

        <RefundDrawer
          refund={selectedRefund}
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          onConfirm={processRefund}
        />

      </main>
    </div>
  );
}
