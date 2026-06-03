// user/account/page.js
import React from "react";

import PersonalInfoSection from "@/components/Account/PersonalInfoSection";
import NotificationPreferencesSection from "@/components/Account/NotificationPreferencesSection";
import DeliveryAddressesSection from "@/components/Account/DeliveryAddressesSection";

const AccountPage = () => {
  return (
    <main className="min-h-screen bg-[#F9FAFB] py-12 px-4 md:px-0">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">My Account</h1>
          <p className="text-gray-500 mt-1">
            Manage your personal information and addresses
          </p>
        </div>

        <PersonalInfoSection />
        <DeliveryAddressesSection />
        <NotificationPreferencesSection />
      </div>
    </main>
  );
};

export default AccountPage;