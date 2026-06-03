import React from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const EmptyCart = () => {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-white px-4 text-center">
      <div className="flex flex-col items-center max-w-md">
        
        {/* Animated Cart Icon Container */}
        <div className="mb-6 rounded-full bg-slate-50 p-6 text-slate-300">
          <ShoppingCart size={64} strokeWidth={1.5} />
        </div>

        {/* Content */}
        <header>
          <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
            Your cart is empty
          </h1>
          <p className="mt-3 text-slate-500 text-sm md:text-base leading-relaxed">
            Browse our verified pharmacies and add products to your cart.
          </p>
        </header>

        {/* Action Button */}
        <div className="mt-8">
          <Link 
            href="/products" 
            className="inline-block bg-[#f06292] hover:bg-[#ec407a] text-white font-medium px-10 py-3 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-pink-100"
          >
            Browse Products
          </Link>
        </div>
        
      </div>
    </main>
  );
};

export default EmptyCart;