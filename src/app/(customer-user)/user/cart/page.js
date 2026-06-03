"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";

import EmptyCart from "@/components/CartPage/EmptyCart";
import CartStore from "@/components/CartPage/CartStore";
import CartSummary from "@/components/CartPage/CartSummary";
import CartSkeleton from "@/components/CartPage/CartSkeleton";
import { useCart } from "@/context/CartContext";


const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState({});
  const [selectedStoreId, setSelectedStoreId] = useState(null);
    const { fetchCartCount } = useCart();
  // ---------------- FETCH CART ----------------
  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await api.get("/customer/cart/read");

      const items = res.data.data.items;

    
      const grouped = items.reduce((acc, item) => {
        const storeId = item.product.owner_id;
        const storeName = item.product.pharmacy_name;

        if (!acc[storeId]) {
          acc[storeId] = {
            storeId,
            storeName,
            // selected: true,
            items: [],
          };
        }

        acc[storeId].items.push({
          id: item.id,
          name: item.product.product_name,
          image: item.product.main_image,
          variant: item.package.package_name,
          price: Number(item.unit_price),
          quantity: item.quantity,
          stock: item.package.stock,
        });

        return acc;
      }, {});

      //setCart(Object.values(grouped));
      const storeArray = Object.values(grouped);

      setCart(storeArray);

      // auto-select first store
      if (storeArray.length > 0) {
        setSelectedStoreId(storeArray[0].storeId);
      }
    } catch (err) {
      console.error(err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);



  const removeItem = async (itemId) => {
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));

    // 1. optimistic update (REMOVE FROM UI FIRST)
    setCart((prev) =>
      prev
        .map((store) => ({
          ...store,
          items: store.items.filter((item) => item.id !== itemId),
        }))
        .filter((store) => store.items.length > 0),
    );

    try {
      await api.delete(`/customer/cart/remove-package/${itemId}`);
      await fetchCartCount();
    } catch (err) {
      console.error(err);
      fetchCart(); // fallback only if error
    } finally {
      setUpdatingItems((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    }
  };

  

  const updateQty = async (itemId, quantity,stock = MAX_QTY) => {
    quantity = Math.max(1, Math.min(quantity, 10, stock));

    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));

    // 1. UPDATE UI FIRST
    setCart((prev) =>
      prev.map((store) => ({
        ...store,
        items: store.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        ),
      })),
    );

    try {
      await api.put(`/customer/cart/update/${itemId}`, {
        quantity,
      });

      await fetchCartCount();
    } catch (err) {
      console.error(err);

      // fallback restore
      fetchCart();
    } finally {
      setUpdatingItems((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    }
  };


  const toggleStore = (storeId) => {
    setSelectedStoreId(storeId);
  };


  const subtotal = cart
    .filter((store) => store.storeId === selectedStoreId)
    .flatMap((store) => store.items)
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const totalItems = cart.reduce(
    (count, store) => count + store.items.length,
    0,
  );

  // ---------------- UI ----------------
  if (loading) return <CartSkeleton />;
  if (totalItems === 0) return <EmptyCart />;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
          <p className="text-sm text-gray-500">{totalItems} items</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT */}
          <section className="grow space-y-4">
            {cart.map((store) => (
              <CartStore
                key={store.storeId}
                store={store}
                toggleStore={toggleStore}
                selectedStoreId={selectedStoreId}
                increaseQty={(itemId, quantity, stock) =>
                  updateQty(itemId, quantity, stock)
                }
                decreaseQty={(itemId, quantity, stock) =>
                  updateQty(itemId, quantity, stock)
                }
                handleQtyChange={(e, itemId, stock) =>
                  updateQty(itemId, Number(e.target.value || 1), stock)
                }
                validateQty={(e, itemId, stock) =>
                  updateQty(
                    itemId,
                    Math.max(1, Number(e.target.value || 1)),
                    stock,
                  )
                }
                removeItem={removeItem}
                updatingItems={updatingItems}
              />
            ))}
          </section>

          {/* RIGHT */}
          <aside className="lg:w-96">
            <CartSummary cart={cart} subtotal={subtotal}  selectedStoreId={selectedStoreId}/>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
