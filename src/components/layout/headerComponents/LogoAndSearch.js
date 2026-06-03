import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeaderSearchBar } from "./HeaderSearchBar";

const LogoAndSearch = ({ role }) => (
  <div className="flex items-center flex-1 gap-4">
    <Link href="/" className="shrink-0">
      <Image src="/logo.svg" alt="Logo" width={120} height={50}  priority style={{ width: "auto", height: "auto" }}  />
    </Link>

    {/* Desktop Search */}
    {["unregistered","CUSTOMER"].includes(role) && (
      <div className="hidden lg:block w-full max-w-md">
        <Suspense fallback={null}>
        <HeaderSearchBar />
      </Suspense>
      </div>
    )}

    {role === "OWNER" && <div className="font-medium text-sm text-[#4A5565]">Seller Portal</div>}
    {role === "admin" && <div className="font-medium text-sm text-[#4A5565]">Admin Console</div>}
  </div>
);

LogoAndSearch.MobileSearch = ({ role }) => {
  if (["unregistered", "CUSTOMER"].includes(role)) return         <Suspense fallback={null}>
        <HeaderSearchBar />
      </Suspense>;
  if (role === "admin") return <label className="font-medium text-sm text-[#4A5565]">Admin Console</label>;
  return null;
};

export default LogoAndSearch;