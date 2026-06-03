"use client"
import Link from "next/link";
import {
  IoClose,
  IoMenu,
  IoGridOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { LuHouse, LuLayoutDashboard, LuStore } from "react-icons/lu";
import { RiRefund2Line } from "react-icons/ri";
import {
  Star,
  Package,
  ClipboardListIcon,
  Warehouse,
  Settings,
} from "lucide-react";
import { AccountDropdownMenu } from "../AccountMenu";
import { LuShoppingCart } from "react-icons/lu";
import { HiOutlineClipboardList } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { MdReviews } from "react-icons/md";
import { GoReport } from "react-icons/go";
import { useCart } from "@/context/CartContext";
import { useEffect } from "react";

const MobileNav = {};

MobileNav.Toggle = ({ isOpen, toggleMenu, role }) => (
  <button onClick={toggleMenu} className="text-gray-700 p-1">
    {isOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
  </button>
);

MobileNav.Menu = ({ isOpen, toggleMenu, role, displayName }) => {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isProducts = pathname.startsWith("/products");
  const isStores = pathname.startsWith("/stores");
  const isCart = pathname.startsWith("/user/cart");
  const isOrders = pathname.startsWith("/user/orders");

  const activeClass = "text-[#F06292] bg-pink-50";
  const normalClass = "hover:text-[#F06292] hover:bg-pink-50";
  const visible = isOpen ? "block" : "hidden";

  const { cartCount, fetchCartCount } = useCart();
  useEffect(() => {
    if (role === "CUSTOMER") {
      fetchCartCount();
    }
  }, [role]);
  return (
    <div
      className={`${visible} lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300`}
    >
      <nav className="flex flex-col p-4 gap-4 text-gray-700">
        {/* Role-specific links */}
        {role === "unregistered" && (
          <>
            <Link
              href="/"
              onClick={toggleMenu}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                isHome ? activeClass : normalClass
              }`}
            >
              <LuHouse /> Home
            </Link>
            <Link
              href="/products"
              onClick={toggleMenu}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                isProducts ? activeClass : normalClass
              }`}
            >
              <IoGridOutline /> Categories & Products
            </Link>
            <hr />
            <Link
              href="/stores?sort=nearest&page=1"
              className={`flex items-center gap-3 p-2 rounded-lg ${
                isStores ? activeClass : normalClass
              }`}
            >
              <IoLocationOutline className="text-[#F06292]" /> Nearby Pharmacies
            </Link>
            <Link href="/login" className="text-[#F06292] font-medium p-2">
              Sign in
            </Link>
            <Link
              href="/registration"
              className="rounded-xl bg-[#F06292] text-white px-5 py-2 hover:bg-[#e91e63]"
            >
              Register
            </Link>
          </>
        )}
        {role === "CUSTOMER" && (
          <>
            <Link
              href="/"
              onClick={toggleMenu}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                isHome ? activeClass : normalClass
              }`}
            >
              <LuHouse /> Home
            </Link>
            <Link
              href="/products"
              onClick={toggleMenu}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                isProducts ? activeClass : normalClass
              }`}
            >
              <IoGridOutline /> Categories & Products
            </Link>
            <hr />
            <Link
              href="/stores"
              className={`flex items-center gap-3 p-2 rounded-lg ${
                isStores ? activeClass : normalClass
              }`}
            >
              <IoLocationOutline className="text-[#F06292]" /> Nearby
            </Link>
            <Link
              href="/user/orders"
              className={`flex items-center gap-3 p-2 rounded-lg ${
                isOrders ? activeClass : normalClass
              }`}
            >
              <HiOutlineClipboardList className="text-[#F06292] p-2" /> My
              Orders
            </Link>

            <Link
              className={`flex items-center gap-3 p-2 rounded-lg ${
                isCart ? activeClass : normalClass
              }`}
              href="/user/cart"
            >
              <LuShoppingCart className="text-[#F06292]" /> Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 min-w-4.5 h-4.5 px-1 rounded-full bg-[#F06292] text-white text-[10px] flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            <span className="p-2">
              <AccountDropdownMenu role={role} displayName={displayName} />
            </span>
          </>
        )}
        {role === "OWNER" && (
          <>
            <Link
              href="/owner/dashboard"
              className="p-2 rounded-lg flex items-center gap-2 hover:text-[#F06292] hover:bg-pink-50"
            >
              <LuLayoutDashboard size={24} /> Dashboard
            </Link>
            <Link
              href="/owner/products"
              className="p-2 rounded-lg flex items-center gap-2 hover:text-[#F06292] hover:bg-pink-50"
            >
              <Package /> Products
            </Link>
            <Link
              href="/owner/orders"
              className="p-2 rounded-lg flex items-center gap-2 hover:text-[#F06292] hover:bg-pink-50"
            >
              <ClipboardListIcon /> Orders
            </Link>
            <Link
              href="/owner/refunds"
              className="p-2 rounded-lg flex items-center gap-2 hover:text-[#F06292] hover:bg-pink-50"
            >
              <RiRefund2Line /> Refunds
            </Link>
            <Link
              href="/owner/reports"
              className="p-2 rounded-lg flex items-center gap-2 hover:text-[#F06292] hover:bg-pink-50"
            >
              <GoReport /> Reports
            </Link>

            <Link
              href="/owner/reviews"
              className="p-2 rounded-lg flex items-center gap-2 hover:text-[#F06292] hover:bg-pink-50"
            >
              <MdReviews /> Reviews
            </Link>

            <Link
              href="/owner/settings"
              className="p-2 rounded-lg flex items-center gap-2 hover:text-[#F06292] hover:bg-pink-50"
            >
              <Settings /> Settings
            </Link>

            <AccountDropdownMenu role={role} displayName={displayName} />
          </>
        )}
        {role === "ADMIN" && (
          <>
            <Link
              href="/admin/dashboard"
              className="p-2 rounded-lg flex items-center gap-2 hover:text-[#F06292] hover:bg-pink-50"
            >
              <LuLayoutDashboard size={24} /> Dashboard
            </Link>
            <Link
              href="/admin/pharmacies"
              className="p-2 rounded-lg flex items-center gap-2 hover:text-[#F06292] hover:bg-pink-50"
            >
              <LuStore size={24} /> Pharmacies
            </Link>
            <Link
              href="/admin/categories"
              className="p-2 rounded-lg flex items-center gap-2 hover:text-[#F06292] hover:bg-pink-50"
            >
              <IoGridOutline size={24} /> Categories
            </Link>
            {/* <Link
              href="/"
              className="p-2 rounded-lg flex items-center gap-2 hover:text-[#F06292] hover:bg-pink-50"
            >
              <RiRefund2Line size={24} /> Refund
            </Link> */}
            <Link
              href="/admin/reviews"
              className="p-2 rounded-lg flex items-center gap-2 hover:text-[#F06292] hover:bg-pink-50"
            >
              <Star /> Reviews
            </Link>
            <AccountDropdownMenu role={role} displayName={displayName} />
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileNav;
