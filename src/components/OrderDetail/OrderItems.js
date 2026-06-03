import React from "react";
import { CreditCard } from "lucide-react";
import Image from "next/image";

export default function OrderItems({
  orderItems = [],
  totalAmount,
  deliveryFee,
  paymentMethod,
  invoice,
  paymentRef,
}) {
  return (
    <>
      <h3 className="text-sm font-bold mb-4 text-gray-600">
        Order Items ({orderItems.length})
      </h3>

      <div className="divide-y divide-gray-50">
        {orderItems.map((item, idx) => {
          const quantity = item.quantity || 0;
          const unitPrice = Number(item.unit_price || 0);
          const total = Number(item.line_total || quantity * unitPrice);

          return (
            <div key={idx} className="py-4 flex justify-between items-start">
              {/* LEFT */}
              <div className="flex gap-3 items-start">
                {/* image */}
                <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={
                      item.product_image
                        ? item.product_image.startsWith("http") ||
                          item.product_image.includes("amazon")
                          ? item.product_image
                          : `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${item.product_image}`
                        : "/placeholder.png"
                    }
                    alt={item.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                {/* text block */}
                <div className="space-y-1">
                  {/* name */}
                  <p className="font-semibold text-sm text-gray-800 leading-tight">
                    {item.name}
                  </p>

                  {/* package */}
                  <p className="text-xs text-gray-400">
                    {item.package_name || "No package info"}
                  </p>

                  {/* qty + price */}
                  <p className="text-xs text-gray-500">
                    Qty {quantity}
                    {unitPrice > 0 && ` × $${unitPrice.toFixed(2)}`}
                  </p>
                </div>
              </div>

              {/* RIGHT (total) */}
              <p className="font-semibold text-sm text-gray-900 whitespace-nowrap">
                ${total.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>

      {/* TOTAL */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-xl font-bold text-pink-400">
            Delivery Fee: ${Number(deliveryFee?deliveryFee:0).toFixed(2)}
          </p>
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-700">Total Amount</h3>
          <p className="text-xl font-bold text-pink-400">
            ${Number(totalAmount).toFixed(2)}
          </p>
        </div>

        <div className="mt-4 text-xs text-gray-400 space-y-1">
          {paymentMethod && (
            <div className="flex items-center gap-2">
              <CreditCard size={14} /> {paymentMethod}
            </div>
          )}

          {invoice && <p>Invoice: {invoice}</p>}
          {paymentRef && <p>Payment Ref: {paymentRef}</p>}
        </div>
      </div>
    </>
  );
}
