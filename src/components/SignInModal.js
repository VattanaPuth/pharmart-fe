"use client";
import React from "react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const SignInModal = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-105 rounded-[28px] p-8 gap-0 border-none shadow-2xl">
        {/* Header with Shield Icon */}
        <DialogHeader className="flex flex-col  justify-center space-y-4">
          <div className="flex items-center gap-2 text-[#1E2939]">
            
            <DialogTitle className="text-xl font-md ">
              Sign In Required
            </DialogTitle>
          </div>
          <hr/>
          <DialogDescription className="text-[#4A5565] text-sm leading-relaxed px-4">
            You need to sign in to add items to your cart and place orders.
          </DialogDescription>
        </DialogHeader>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-8">
          <Link
            className="w-full py-4 bg-[#F06292] hover:bg-[#F06292] text-white font-bold rounded-2xl transition-colors shadow-lg shadow-pink-100"
            href={"/login"}
          >
            Sign In
          </Link>
          
          <Link
            className="w-full py-4 bg-white border-2 border-slate-100 hover:border-[#F06292]/30 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl transition-all"
            href={"/registration"}
          >
            Create Account
          </Link>

          <button 
            className="w-full py-3 text-[#6A7282] hover:text-slate-600 text-sm font-medium transition-colors"
            onClick={() => onOpenChange(false)}
          >
            Continue browsing as guest
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};