"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { IoLocationOutline } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";
import { HiOutlineClipboardList } from "react-icons/hi";

import api from "@/lib/axios";

import { AccountDropdownMenu } from "../AccountMenu";
import CustomerNotificationButtonBell from "./CustomerNotificationButtonBell";
import PharmacyNotificationButtonBell from "./PharmacyNotificationButtonBell";
import AdminNotificationButtonBell from "./AdminNotificationButtonBell";
import { useCart } from "@/context/CartContext";

const DesktopNav = ({ user, role, loading, displayName }) => {
  const pathname = usePathname();

  const { cartCount, fetchCartCount } = useCart();

    const [location, setLocation] = useState({
      lat: null,
      lng: null,
    });
  
    useEffect(() => {
      if (!navigator.geolocation) return;
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.log("Location denied", err);
        },
      );
    }, []);


  const isCart = pathname.startsWith("/user/cart");
  const isOrders = pathname.startsWith("/user/orders");
  const isStores = pathname.startsWith("/stores");

  const activeClass = "text-[#F06292]";
  const normalClass = "hover:text-[#F06292]";

  // =========================
  // fetch cart count
  // =========================
useEffect(() => {
  if (role === "CUSTOMER") {
    fetchCartCount();
  }
}, [role]);

  return (
    <nav className="hidden lg:flex gap-6 items-center text-[#4A5565] text-sm">
      {role === "CUSTOMER" && (
        <>
          <Link
            href="/stores?type=stores&sort=nearest&page=1"
            className={`flex items-center gap-1 ${
              isStores ? activeClass : normalClass
            }`}
          >
            <IoLocationOutline className="text-[#F06292]" />
            Nearby Pharmacies
          </Link>

          <Link
            href="/user/orders"
            className={`flex items-center gap-1 ${
              isOrders ? activeClass : normalClass
            }`}
          >
            <HiOutlineClipboardList className="text-[#F06292]" />
            My Orders
          </Link>

          {/* ========================= */}
          {/* CART ICON */}
          {/* ========================= */}
          <Link
            href="/user/cart"
            className={`relative ${isCart ? activeClass : normalClass}`}
          >
            <LuShoppingCart size={20} />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 min-w-4.5 h-4.5 px-1 rounded-full bg-[#F06292] text-white text-[10px] flex items-center justify-center font-semibold">
                {cartCount}
              </span>
            )}
          </Link>

          {!loading &&
            user &&
            role !== "ADMIN" &&
            role !== "OWNER" && (
              <CustomerNotificationButtonBell role={role} />
            )}

          <AccountDropdownMenu
            role={role}
            displayName={displayName}
          />
        </>
      )}

      {role === "unregistered" && (
        <>
          <Link
            href="/stores"
            className="flex items-center gap-1 hover:text-[#F06292]"
          >
            <IoLocationOutline className="text-[#F06292]" />
            Nearby
          </Link>

          <Link href="/login" className="text-[#F06292] font-medium">
            Sign in
          </Link>

          <Link
            href="/registration"
            className="rounded-xl bg-[#F06292] text-white px-5 py-2.5 hover:bg-[#e91e63]"
          >
            Register
          </Link>
        </>
      )}

      {role === "OWNER" && (
        <>
          <PharmacyNotificationButtonBell role={role} />
          <AccountDropdownMenu
            role={role}
            displayName={displayName}
          />
        </>
      )}

      {role === "ADMIN" && (
        <>
          <AdminNotificationButtonBell role={role} />
          <AccountDropdownMenu
            role={role}
            displayName={displayName}
          />
        </>
      )}
    </nav>
  );
};

export default DesktopNav;