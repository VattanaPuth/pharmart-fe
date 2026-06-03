import React from "react";
import { Bell } from "lucide-react";

const NotificationPreferencesSection = () => {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-2 mb-8 text-[#F06292]">
        <Bell size={20} />
        <h2 className="text-xl font-semibold text-slate-800">
          Notification Preferences
        </h2>
      </div>

      <div className="space-y-6">
        <NotificationToggle
          title="Order Updates"
          description="Receive emails about order status changes"
          defaultChecked={true}
        />
        <NotificationToggle
          title="Refund Updates"
          description="Get notified about refund request status"
          defaultChecked={true}
        />
      </div>
    </section>
  );
};

const NotificationToggle = ({ title, description, defaultChecked }) => {
  return (
    <div className="flex justify-between items-center border-t first:border-t-0 border-gray-50 pt-6">
      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
      </label>
    </div>
  );
};

export default NotificationPreferencesSection;