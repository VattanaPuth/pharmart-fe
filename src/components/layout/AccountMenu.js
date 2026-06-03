"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { HiOutlineClipboardList } from "react-icons/hi";
import { LuUser, LuLogOut, LuChevronDown } from "react-icons/lu";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";

export function AccountDropdownMenu({ displayName, role }) {
  const router = useRouter();
  const { setAuth } = useAuth();


  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Sign out?",
      text: "You will need to login again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Sign out",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem("token");
    

    try {
      if (token) {
        if (role === "ADMIN") {
          await api.post("/admin/logout");
        } else {
          await api.post("/user_logout");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");//for admin
      document.cookie = "token=; Max-Age=0; path=/";
      setAuth(null);
      router.replace("/login");
      
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-1.5 text-sm font-medium cursor-pointer hover:text-pink-900">
          <div className="p-1.5 rounded-full bg-[#FCE4EC] text-[#F06292]">
            <LuUser size={16} />
          </div>

          {displayName || "User"}

          <LuChevronDown size={12} />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <div className="flex flex-col px-2 py-1">
            <label className="text-sm font-bold text-[#1E2939]">
              {displayName || "User"}
            </label>
            <label className="text-[#6A7282] text-xs">{role || "User"}</label>
          </div>

          <DropdownMenuSeparator />

          {role == "CUSTOMER" ? (
            <>
              <DropdownMenuItem
                onClick={() => router.push("/user/orders")}
                className="text-[#364153] cursor-pointer"
              >
                <HiOutlineClipboardList />
                <span className="text-sm ml-2">My Orders</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push("/user/account")}
                className="text-[#364153] cursor-pointer"
              >
                <LuUser />
                <span className="text-sm ml-2">Account & Settings</span>
              </DropdownMenuItem>
            </>
          ):<></>}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-[#E7000B] font-medium cursor-pointer hover:bg-[#E7000B]/10"
        >
          <LuLogOut size={16} className="text-[#E7000B]" />
          <span className="ml-2">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
