"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Search, ChevronDown,UserPlus, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const Header = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  // Close when click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-4">
  {/* Logo */}
  <img
    src="/logo.png"
    alt="Pharmart"
    className="h-10 w-auto"
  />

  {/* Divider */}
  <div className="w-px h-8 bg-gray-200" />

  {/* Shield icon + Admin Console */}
  <div className="flex items-center gap-2">
    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
    <p className="text-lg font-semibold text-gray-600">Admin Console</p>
  </div>
</div>
          {/* Right */}
          <div className="flex items-center space-x-6">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
              />
            </div>

            {/* Notification */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
              >

                <div className="flex items-center gap-2">
    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
    <p className="text-lg  text-gray-600">Admin</p>
  </div>

                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border z-50 animate-fadeIn">
                  
                  <div className="p-3 border-b">
                    <p className="text-sm font-semibold text-gray-500">Admin User</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>

                  <button 
  onClick={() => router.push('/register')}
  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm text-gray-600"
>
  <UserPlus size={16} />
  Create Account
</button>

<button 
  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm text-red-500"
>
  <LogOut size={16} />
  Sign Out
</button>


                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
