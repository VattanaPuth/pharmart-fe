"use client"

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

const CartSummary = ({ cart,selectedStoreId, subtotal }) => {

// const selectedStoreIds = cart
//   .filter(store => store.selected)
//   .map(store => store.storeId);
const router = useRouter();

const goToCheckout = async () => {
  try {
    if (!selectedStoreId) return;

    const res = await api.post("/customer/checkout/session", {
      store_ids: [selectedStoreId],
    });

    const sessionId = res.data.data.id;
    router.push(`/user/checkout?sessionId=${sessionId}`);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">

      <h2 className="text-lg font-bold text-slate-800 mb-6">Order Summary</h2>

      <div className="space-y-3 mb-6">
        {cart.filter(store => store.selected)
             .flatMap(store => store.items)
             .map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-500 truncate mr-4">{item.name} ×{item.quantity}</span>
            <span className="text-slate-700 font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <hr className="border-gray-50 mb-4" />

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium">Subtotal</span>
          <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-xs text-gray-400">
          <span>Delivery fees</span>
          <span className="italic">Per your arrangement</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="font-bold">Total</span>
          <span className="text-[#F06292] font-bold text-xl">${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8 space-y-4 ">
        <button onClick={goToCheckout} className="w-full bg-[#F06292] hover:bg-pink-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
          Proceed to Checkout
          <ArrowRight size={18} />
        </button>

        <Link href={"/products"} className="w-full text-pink-400 font-medium text-sm hover:text-[#F06292]">
          Continue Shopping
        </Link>
      </div>

    </div>
  );
};

export default CartSummary;