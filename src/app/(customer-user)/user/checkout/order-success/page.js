import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const OrderSuccess = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#fcfdfe] px-4 text-center">
      <div className="max-w-xl animate-in fade-in zoom-in duration-500">
        
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Soft outer glow */}
            <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-50 scale-150"></div>
            <div className="relative bg-green-50 p-5 rounded-full">
              <CheckCircle2 size={64} className="text-green-500" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Messaging */}
        <header className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Order Placed Successfully!
          </h1>
          <div className="space-y-2">
            <p className="text-slate-500 font-medium">
              Payment processed via Stripe. Your order is now pending seller confirmation.
            </p>
            <p className="text-gray-400 text-sm">
              You'll receive a notification when the seller confirms your order.
            </p>
          </div>
        </header>

        {/* Action Buttons */}
        <nav className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/user/orders" 
            className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white font-bold px-10 py-3.5 rounded-2xl transition-all shadow-lg shadow-pink-100"
          >
            View My Orders
          </Link>
          <Link 
            href="/user/products" 
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-slate-600 font-semibold px-10 py-3.5 rounded-2xl border border-gray-100 transition-all"
          >
            Continue Shopping
          </Link>
        </nav>
        
      </div>
    </main>
  );
};

export default OrderSuccess;