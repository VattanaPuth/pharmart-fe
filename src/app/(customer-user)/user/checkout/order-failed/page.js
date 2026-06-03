import React from 'react';
import { XCircle, RefreshCw, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const PaymentFailed = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#fcfdfe] px-4 text-center">
      <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Soft red/orange glow */}
            <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-40 scale-150"></div>
            <div className="relative bg-red-50 p-5 rounded-full">
              <XCircle size={64} className="text-red-500" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Messaging */}
        <header className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Payment Failed
          </h1>
          <div className="space-y-2">
            <p className="text-slate-500 font-medium">
              We couldn't process your transaction. This might be due to insufficient funds or a connection issue with Stripe.
            </p>
            <p className="text-gray-400 text-sm">
              Don't worry, no funds were deducted from your account.
            </p>
          </div>
        </header>

        {/* Action Buttons */}
        <nav className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/user/cart" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold px-10 py-3.5 rounded-2xl transition-all shadow-lg shadow-pink-100"
          >
            <RefreshCw size={18} /> Try Again
          </Link>
          <Link 
            href="/user/support" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-slate-600 font-semibold px-10 py-3.5 rounded-2xl border border-gray-100 transition-all"
          >
            <MessageCircle size={18} /> Contact Support
          </Link>
        </nav>

        {/* Secondary Action */}
        <div className="mt-8">
          <Link href="/user/cart" className="text-gray-400 hover:text-pink-500 text-sm font-medium transition-colors">
            Return to Shopping Cart
          </Link>
        </div>
        
      </div>
    </main>
  );
};

export default PaymentFailed;