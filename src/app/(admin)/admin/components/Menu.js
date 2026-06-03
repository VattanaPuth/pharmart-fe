// components/Menu.jsx
"use client";

import React from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  Tags, 
  RotateCcw, 
  Star 
} from 'lucide-react';

// Route-based menu: one menu item -> one page/folder
const Menu = () => {
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', count: null },
    { id: 'pharmacies', href: '/pharmacies', icon: Building2, label: 'Pharmacies', count: 4 },
    { id: 'categories', href: '/categories', icon: Tags, label: 'Categories', count: null },
    { id: 'refunds', href: '/refunds', icon: RotateCcw, label: 'Refunds', count: 2 },
    { id: 'reviews', href: '/reviews', icon: Star, label: 'Reviews', count: null }
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-8">
        <ul className="flex space-x-8">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    isActive 
                      ? 'border-pink-500 text-pink-600' 
                      : 'border-transparent text-gray-700 hover:text-pink-600 hover:border-pink-300'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.count != null && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-emerald-100 text-gray-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Menu;