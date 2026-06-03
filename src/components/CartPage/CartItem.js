"use client";

import React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

const CartItem = ({
  item,
  storeId,
  increaseQty,
  decreaseQty,
  handleQtyChange,
  validateQty,
  removeItem,
  isUpdating,
}) => {
  const [localQty, setLocalQty] = useState(item.quantity);

  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  return (
    <article className="p-6 flex flex-col sm:flex-row items-center gap-6">
      {/* IMAGE */}
      <div className="w-24 h-20 bg-gray-100 rounded-lg relative overflow-hidden border border-gray-100">
        <Image
          src={
            item.image
              ? item.image.startsWith("http") || item.image.includes("amazon")
                ? item.image
                : `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${item.image}`
              : "/placeholder.png"
          }
          alt={item.name}
          fill
          className="object-contain"
          unoptimized
        />
      </div>

      {/* INFO */}
      <div className="grow text-center sm:text-left">
        <h3 className="font-bold text-slate-800">{item.name}</h3>
        <p className="text-base text-gray-400 mt-1">{item.variant}</p>

        {item.stock <= 0 && (
          <p className="text-xs text-red-500 mt-1 font-medium">Out of stock</p>
        )}

        {item.stock > 0 && item.stock <= 5 && (
          <p className="text-xs text-orange-500 mt-1 font-medium">
            Only {item.stock} left
          </p>
        )}

        {/* QUANTITY */}
        <div className="flex items-center justify-center sm:justify-start mt-3">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => decreaseQty(item.id, localQty - 1, item.stock)}
              disabled={isUpdating || Number(localQty) <= 1 || item.stock <= 0}
            >
              <Minus size={14} />
            </button>

            <input
              type="number"
              min="1"
              max={Math.min(10, item.stock || 1)}
              value={localQty}
              disabled={isUpdating || item.stock <= 0}
              onChange={(e) => {
                let val = e.target.value;

                if (val === "") {
                  setLocalQty("");
                  return;
                }

                if (!/^\d+$/.test(val)) return;

                val = Number(val);

                const clamped = Math.min(val, 10, item.stock || 1);

                setLocalQty(clamped);
              }}
              onBlur={() => {
                const value = Math.max(
                  1,
                  Math.min(Number(localQty) || 1, 10, item.stock || 1),
                );
                validateQty({ target: { value } }, item.id, item.stock);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = Math.max(
                    1,
                    Math.min(Number(localQty) || 1, 10, item.stock || 1),
                  );
                  validateQty({ target: { value } }, item.id, item.stock);
                }
              }}
              className="w-16 text-center text-sm font-medium outline-none"
            />

            <button
              onClick={() =>
                increaseQty(item.id, Number(localQty) + 1, item.stock)
              }
              disabled={
                isUpdating ||
                Number(localQty) >= 10 ||
                Number(localQty) >= item.stock ||
                item.stock <= 0
              }
            >
              <Plus size={14} />
            </button>

            {/* <button
              onClick={() => removeItem(item.id)}
              className="text-gray-300 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button> */}
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">Max order: 10</p>
      </div>

      {/* PRICE */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-gray-400">Unit price</p>

          <p className="text-sm font-semibold text-gray-700">
            ${item.price.toFixed(2)}
          </p>

          <p className="text-xl text-gray-400">
            × {item.quantity} ={" "}
            <span className="text-[#F06292] font-bold">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={() => removeItem(item.id)}
          className="text-gray-300 hover:text-red-500 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
};

export default CartItem;
