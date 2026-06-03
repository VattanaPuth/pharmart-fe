"use client";

import { useEffect, useState } from "react";
import { LuBell } from "react-icons/lu";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const NotificationSkeleton = () => (
  <div className="animate-pulse border-b p-3">
    <div className="mb-2 h-3 w-3/4 rounded bg-gray-200" />
    <div className="h-2 w-1/3 rounded bg-gray-100" />
  </div>
);

const AdminNotificationButtonBell = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loadingList, setLoadingList] = useState(false);

  // =========================
  // API URLS
  // =========================
  const baseUrl = "/admin/notifications";

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
const fetchNotifications = async () => {
  try {
    setLoadingList(true);

    const res = await api.get(baseUrl);

    setNotifications(res.data || []); // ✅ FIX HERE
  } catch (err) {
    console.error("fetchNotifications error:", err);
  } finally {
    setLoadingList(false);
  }
};

  // =========================
  // FETCH UNREAD COUNT
  // =========================
  const fetchUnreadCount = async () => {
    try {
      const res = await api.get(`${baseUrl}/unread-count`);

      setUnreadCount(res.data.unread_count || 0);
    } catch (err) {
      console.error("fetchUnreadCount error:", err);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetchNotifications();
    fetchUnreadCount();

    // auto refresh every 30s
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // TOGGLE DROPDOWN
  // =========================
  const toggleDropdown = () => {
    const token = localStorage.getItem("token");

    setIsOpen((prev) => {
      const next = !prev;

      if (next && token) {
        fetchNotifications();
        //fetchUnreadCount();
      }

      return next;
    });
  };

  // =========================
  // MARK READ
  // =========================
  const markRead = async (id) => {
    try {
      await api.put(`${baseUrl}/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                is_read: true,
              }
            : n,
        ),
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("markRead error:", err);
    }
  };

  // =========================
  // MARK ALL READ
  // =========================
  const markAllRead = async () => {
    try {
      await api.put(`${baseUrl}/read-all`);

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: true,
        })),
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("markAllRead error:", err);
    }
  };

  return (
    <div className="relative">
      {/* Bell */}
      <button
        onClick={toggleDropdown}
        className="relative rounded-full p-2 hover:bg-gray-100"
      >
        <LuBell size={24} className="text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-3">
            <span className="text-sm font-semibold">Notifications</span>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-pink-500 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loadingList && (
              <>
                <NotificationSkeleton />
                <NotificationSkeleton />
                <NotificationSkeleton />
              </>
            )}

            {!loadingList && notifications.length === 0 && (
              <p className="p-4 text-center text-sm text-gray-400">
                No notifications
              </p>
            )}

            {!loadingList &&
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`cursor-pointer border-b p-3 transition hover:bg-gray-50 ${
                    n.is_read ? "text-gray-500" : "bg-pink-50 font-medium"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{n.title}</p>

                      <p className="mt-1 text-sm">{n.message}</p>

                      <p className="mt-2 text-xs text-gray-400">
                        {n.created_at}
                      </p>
                    </div>

                    {!n.is_read && (
                      <div className="mt-1 h-2 w-2 rounded-full bg-pink-500" />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotificationButtonBell;
