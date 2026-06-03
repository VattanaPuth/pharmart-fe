"use client";

import React from "react";
import CartItem from "./CartItem";

const CartStore = ({
  store,
  toggleStore,
  selectedStoreId,
  increaseQty,
  decreaseQty,
  handleQtyChange,
  validateQty,
  removeItem,
  updatingItems,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* STORE HEADER */}
      <div className="p-4 border-b border-gray-50 flex items-center gap-3">
        <input
          type="checkbox"
          // checked={store.selected}
          checked={selectedStoreId === store.storeId}
          onChange={() => toggleStore(store.storeId)}
        />

        <span className="font-medium text-sm">{store.storeName}</span>
      </div>

      {/* ITEMS */}
      <div className="divide-y divide-gray-50">
        {store.items?.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            increaseQty={increaseQty}
            decreaseQty={decreaseQty}
            handleQtyChange={handleQtyChange}
            validateQty={validateQty}
            removeItem={removeItem}
            isUpdating={updatingItems[item.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default CartStore;
