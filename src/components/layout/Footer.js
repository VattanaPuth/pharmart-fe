import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative bg-[#f9fafb] pt-16 pb-10 px-4 md:px-16 lg:px-28">

      {/* Floating card wrapper (POP EFFECT) */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg border border-slate-100 -mt-20 p-10 transition-all hover:shadow-2xl">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo */}
          <section className="flex flex-col items-start sm:items-start">
            <div className="relative w-36 h-36 mb-4">
              <Image
                src="/logo.svg"
                alt="logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your trusted online pharmacy marketplace.<br />
              Only verified pharmacies.
            </p>
          </section>

          {/* Customers */}
          <section>
            <h3 className="text-base font-bold mb-4">For Customers</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link className="hover:text-pink-500" href="#">Browse Pharmacies</Link></li>
              <li><Link className="hover:text-pink-500" href="#">Search Products</Link></li>
              <li><Link className="hover:text-pink-500" href="#">Track Orders</Link></li>
              <li><Link className="hover:text-pink-500" href="#">Invoices & Receipts</Link></li>
            </ul>
          </section>

          {/* Pharmacies */}
          <section>
            <h3 className="text-base font-bold mb-4">For Pharmacies</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link className="hover:text-pink-500" href="#">Register Pharmacy</Link></li>
              <li><Link className="hover:text-pink-500" href="#">eKYC Verification</Link></li>
              <li><Link className="hover:text-pink-500" href="#">Manage Products</Link></li>
              <li><Link className="hover:text-pink-500" href="#">Process Orders</Link></li>
            </ul>
          </section>

          {/* Support */}
          <section>
            <h3 className="text-base font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link className="hover:text-pink-500" href="#">Help Center</Link></li>
              <li><Link className="hover:text-pink-500" href="#">Contact Us</Link></li>
              <li><Link className="hover:text-pink-500" href="#">Privacy Policy</Link></li>
              <li><Link className="hover:text-pink-500" href="#">Terms of Service</Link></li>
            </ul>
          </section>

        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-8" />

        {/* Bottom */}
        <div className="text-center text-sm text-slate-400">
          © 2026 Pharmart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;