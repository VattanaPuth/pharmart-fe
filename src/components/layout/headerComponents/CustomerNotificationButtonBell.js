"use client";

import { useEffect, useState } from "react";
import { LuBell } from "react-icons/lu";
import api from "@/lib/axios";

const CustomerNotificationSkeleton = () => (
  <div className="p-3 animate-pulse">
    <div className="h-3 w-3/4 bg-gray-200 rounded mb-2" />
    <div className="h-2 w-1/3 bg-gray-100 rounded" />
  </div>
);

const CustomerNotificationButtonBell = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [loadingList, setLoadingList] = useState(false);

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
  const fetchNotifications = async () => {
    try {
      setLoadingList(true);

      const res = await api.get("/notifications/filter");

      setNotifications(res.data.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  // =========================
  // FETCH UNREAD COUNT
  // =========================
  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications/unread-count");
      setUnreadCount(res.data.unread_count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // not logged in → do nothing
    if (!token) return;

    fetchNotifications();
    fetchUnreadCount();
    
        const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // TOGGLE
  // =========================
  const toggleDropdown = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    setIsOpen((prev) => {
      const next = !prev;

      // only fetch when opening AND logged in
      if (next && token) {
        fetchNotifications();
        fetchUnreadCount();
      }

      return next;
    });
  };

  // =========================
  // MARK ONE READ
  // =========================
  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n)),
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // MARK ALL READ
  // =========================
  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));

      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

      const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("en-GB", {
          timeZone: "Asia/Phnom_Penh",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <LuBell size={24} className="text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border z-50">
          {/* HEADER */}
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold text-sm">Notifications</span>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-pink-500 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* LIST */}
          <div className="max-h-80 overflow-y-auto">
            {loadingList && (
              <>
                <CustomerNotificationSkeleton />
                <CustomerNotificationSkeleton  />
                <CustomerNotificationSkeleton  />
              </>
            )}

            {!loadingList && notifications.length === 0 && (
              <p className="text-center text-sm text-gray-400 p-4">
                No notifications
              </p>
            )}

            {!loadingList &&
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    n.is_read ? "text-gray-500" : "bg-gray-50 font-medium"
                  }`}
                >
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-gray-400">{formatDate(n.created_at)}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerNotificationButtonBell;
