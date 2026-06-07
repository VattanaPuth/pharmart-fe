"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import LogoAndSearch from "./headerComponents/LogoAndSearch";
import DesktopNav from "./headerComponents/DesktopNav";
import MobileNav from "./headerComponents/MobileNav";
import BottomBar from "./headerComponents/BottomBar";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import AdminNotificationButtonBell from "./headerComponents/AdminNotificationButtonBell";
import PharmacyNotificationButtonBell from "./headerComponents/PharmacyNotificationButtonBell";
import CustomerNotificationButtonBell from "./headerComponents/CustomerNotificationButtonBell";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    profile,
    user,
    displayName,
    loading,
    owner
  } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const role = user?.role || "unregistered";

  const toggleMenu = () => setIsOpen(!isOpen);

  // =========================
  // loading toast
  // =========================
  useEffect(() => {
    let toastId;

    if (loading) {
      toastId = toast.loading("Loading account...");
    } else {
      toast.dismiss();
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [loading]);

  // =========================
  // onboarding redirect
  // =========================
  useEffect(() => {
    const isAuthPage =
      pathname.startsWith("/login") || pathname.startsWith("/registration");

    if (isAuthPage) return;
    if (!user) return;

    if (user.role === "CUSTOMER" && user.onboarding_completed === 0) {
      router.push("/registration/onboarding/customer");
    }

    if (user.role === "OWNER" && user.onboarding_completed === 0 && owner?.id) {
      router.push(`/registration/onboarding/owner?owner_id=${owner.id}`);
    }
  }, [owner?.id, pathname, router, user]);

  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-white">
      <div className="px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <LogoAndSearch role={role} />

          <DesktopNav
            user={user}
            role={role}
            loading={loading}
            displayName={displayName}
          />

          <div className="flex items-center gap-4 lg:hidden">
            {!loading &&
              user &&
              role !== "ADMIN" &&
              role !== "OWNER" &&
              role === "CUSTOMER" && (
                <CustomerNotificationButtonBell role={role} />
              )}

            {!loading && user && role === "OWNER" && (
              <PharmacyNotificationButtonBell role={role} />
            )}

            {!loading && user && role === "ADMIN" && (
              <AdminNotificationButtonBell role={role} />
            )}

            <MobileNav.Toggle
              isOpen={isOpen}
              toggleMenu={toggleMenu}
              role={role}
            />
          </div>
        </div>

        {["unregistered", "CUSTOMER"].includes(role) && (
          <div className="mt-4 lg:hidden">
            <LogoAndSearch.MobileSearch role={role} />
          </div>
        )}
      </div>

      <MobileNav.Menu
        isOpen={isOpen}
        toggleMenu={toggleMenu}
        role={role}
        displayName={displayName}
      />

      <BottomBar
        role={role}
        onboarding_completed={user?.onboarding_completed}
        ekyc_status={profile?.status}
      />
    </header>
  );
};

export default Header;
