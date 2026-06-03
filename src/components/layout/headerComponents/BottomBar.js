import Link from "next/link";
import { LuHouse, LuLayoutDashboard, LuStore } from "react-icons/lu";
import { IoGridOutline } from "react-icons/io5";
import { RiRefund2Line } from "react-icons/ri";
import {
  Star,
  Package,
  ClipboardListIcon,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { GoReport } from "react-icons/go";
import { MdReviews } from "react-icons/md";

const BottomBar = ({ role, ekyc_status }) => {
  const pathname = usePathname();

  const activeClass = "text-[#F06292] bg-pink-50";
  const normalClass = "hover:text-[#F06292] hover:bg-pink-50";

  const isActive = (path) => pathname === path || pathname.startsWith(path);

  return (
    <nav className="hidden lg:flex max-w-7xl gap-8 text-gray-700 text-sm px-6 py-2 border-t border-gray-50">
      {/* ================= CUSTOMER ================= */}
      {["unregistered", "CUSTOMER"].includes(role) && (
        <>
          <Link
            href="/"
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isActive("/") && pathname === "/" ? activeClass : normalClass
            }`}
          >
            <LuHouse /> Home
          </Link>

          <Link
            href="/products"
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isActive("/products") ? activeClass : normalClass
            }`}
          >
            <IoGridOutline /> Categories & Products
          </Link>
        </>
      )}

      {/* ================= OWNER ================= */}
      {role === "OWNER" && (
        <>
          <Link
            href="/owner/dashboard"
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isActive("/owner/dashboard") ? activeClass : normalClass
            }`}
          >
            <LuLayoutDashboard /> Dashboard
          </Link>

          <Link
            href={ekyc_status === "approved" ? "/owner/products" : "#"}
            className={`p-2 rounded-lg flex items-center gap-2 ${
              ekyc_status !== "approved"
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : isActive("/owner/products")
                  ? activeClass
                  : normalClass
            }`}
            onClick={(e) => ekyc_status !== "approved" && e.preventDefault()}
          >
            <Package /> Products
          </Link>

          <Link
            href={ekyc_status === "approved" ? "/owner/orders" : "#"}
            className={`p-2 rounded-lg flex items-center gap-2 ${
              ekyc_status !== "approved"
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : isActive("/owner/orders")
                  ? activeClass
                  : normalClass
            }`}
            onClick={(e) => ekyc_status !== "approved" && e.preventDefault()}
          >
            <ClipboardListIcon /> Orders
          </Link>

          <Link
            href={ekyc_status === "approved" ? "/owner/refunds" : "#"}
            className={`p-2 rounded-lg flex items-center gap-2 ${
              ekyc_status !== "approved"
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : isActive("/owner/refunds")
                  ? activeClass
                  : normalClass
            }`}
            onClick={(e) => ekyc_status !== "approved" && e.preventDefault()}
          >
            <RiRefund2Line /> Refunds
          </Link>
          <Link
            href={ekyc_status === "approved" ? "/owner/reports" : "#"}
            className={`p-2 rounded-lg flex items-center gap-2 ${
              ekyc_status !== "approved"
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : isActive("/owner/reports")
                  ? activeClass
                  : normalClass
            }`}
            onClick={(e) => ekyc_status !== "approved" && e.preventDefault()}
          >
            <GoReport/> Reports
          </Link>

                    <Link
            href={ekyc_status === "approved" ? "/owner/reviews" : "#"}
            className={`p-2 rounded-lg flex items-center gap-2 ${
              ekyc_status !== "approved"
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : isActive("/owner/reviews")
                  ? activeClass
                  : normalClass
            }`}
            onClick={(e) => ekyc_status !== "approved" && e.preventDefault()}
          >
            <MdReviews /> Reviews
          </Link>

          <Link
            href={ekyc_status === "approved" ? "/owner/settings" : "#"}
            className={`p-2 rounded-lg flex items-center gap-2 ${
              ekyc_status !== "approved"
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : isActive("/owner/settings")
                  ? activeClass
                  : normalClass
            }`}
            onClick={(e) => ekyc_status !== "approved" && e.preventDefault()}
          >
            <Settings /> Settings
          </Link>


        </>
      )}

      {/* ================= ADMIN ================= */}
      {role === "ADMIN" && (
        <>
          <Link
            href="/admin/dashboard"
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isActive("/admin/dashboard") ? activeClass : normalClass
            }`}
          >
            <LuLayoutDashboard /> Dashboard
          </Link>

          <Link
            href="/admin/pharmacies"
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isActive("/admin/pharmacies") ? activeClass : normalClass
            }`}
          >
            <LuStore /> Pharmacies
          </Link>

          <Link
            href="/admin/categories"
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isActive("/admin/categories") ? activeClass : normalClass
            }`}
          >
            <IoGridOutline /> Categories
          </Link>

          <Link
            href="/admin/reviews"
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isActive("/admin/reviews") ? activeClass : normalClass
            }`}
          >
            <Star /> Reviews
          </Link>
        </>
      )}
    </nav>
  );
};

export default BottomBar;
