"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/axios";

import { Store, Truck, CreditCard, Banknote, Lock } from "lucide-react";
import StripePaymentForm from "@/components/CartPage/StripePaymentForm";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
console.log(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CheckoutPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("sessionId");

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fulfillment, setFulfillment] = useState("pickup");
  const [payment, setPayment] = useState("online");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  // ---------------- LOAD SESSION ----------------
  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setSession(null);
      return;
    }

    const fetchSession = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/customer/checkout/session/${sessionId}`);
        const data = res.data.data;

        setSession(data);

        // ✅ FIX: sync default values to backend if empty
        if (!data.fulfillment_method) {
          await updateSession("fulfillment_method", "pickup");
          setFulfillment("pickup");
        } else {
          setFulfillment(data.fulfillment_method);
        }

        if (!data.payment_method) {
          await updateSession("payment_method", "online");
          setPayment("online");
        } else {
          setPayment(data.payment_method);
        }
      } catch (err) {
        console.error(err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  // ---------------- GROUP BY STORE ----------------
  const storeList = useMemo(() => {
    if (!session?.items) return [];

    const grouped = session.items.reduce((acc, item) => {
      const storeId = item.owner_id;

      if (!acc[storeId]) {
        acc[storeId] = {
          storeId,
          storeName: item.owner_name,
          items: [],
          total: 0,
        };
      }

      acc[storeId].items.push(item);
      acc[storeId].total += parseFloat(item.line_total);

      return acc;
    }, {});

    return Object.values(grouped);
  }, [session]);

  // ---------------- UPDATE SESSION ----------------
  const updateSession = async (field, value) => {
    try {
      const res = await api.put(`/customer/checkout/session/${sessionId}`, {
        [field]: value,
      });

      setSession(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- CONFIRM CHECKOUT ----------------
  const confirmCheckout = async () => {
    if (!session?.id) return;

    // ✅ ensure defaults are saved BEFORE confirm
    if (!session.fulfillment_method) {
      await updateSession("fulfillment_method", fulfillment);
    }

    if (!session.payment_method) {
      await updateSession("payment_method", payment);
    }

    try {
      await api.post(`/customer/checkout/session/${session.id}/confirm`);
      router.push("/user/checkout/order-success");
    } catch (err) {
      
  console.error("STATUS:", err?.response?.status);
  console.error("DATA:", err?.response?.data);
  console.error("MESSAGE:", err?.response?.data?.message);

      router.push("/user/checkout/order-failed");
    }
  };

  useEffect(() => {
    if (fulfillment !== "delivery") return;
    setLoadingAddress(true);

    const fetchAddresses = async () => {
      try {
        const res = await api.get(
          "/customer/delivery-address/getDeliveryAddress",
        );

        const data = res.data.data;
        setAddresses(data);

        setLoadingAddress(false);

        // auto select default address
        const def = data.find((a) => a.is_default === 1);

        if (def) {
          setSelectedAddress(def.id);

          if (session?.id) {
            updateSession(
              "delivery_address",
              `${def.full_address}, ${def.city}`,
            );
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAddresses();
  }, [fulfillment, session?.id]); // ✅ IMPORTANT FIX

  const deliveryFee = fulfillment === "delivery" ? 2 : 0;
  const grandTotal =
  Number(session?.subtotal || 0) + deliveryFee;
  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-pink-500 font-medium animate-pulse">
          Preparing your checkout...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        No checkout session found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h1 className="text-2xl font-bold text-slate-800">Secure Checkout</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review items grouped by pharmacy before confirming order
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT */}
          <div className="grow space-y-6">
            {/* FULFILLMENT */}
            <section className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="font-bold mb-4">Fulfillment Method</h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setFulfillment("pickup");
                    updateSession("fulfillment_method", "pickup");
                  }}
                  className={`p-5 rounded-2xl border flex items-center gap-3 ${
                    fulfillment === "pickup"
                      ? "border-pink-500 bg-pink-50"
                      : "border-slate-200"
                  }`}
                >
                  <Store />
                  Pickup
                </button>

                <button
                  onClick={() => {
                    setFulfillment("delivery");
                    updateSession("fulfillment_method", "delivery");
                  }}
                  className={`p-5 rounded-2xl border flex items-center gap-3 ${
                    fulfillment === "delivery"
                      ? "border-pink-500 bg-pink-50"
                      : "border-slate-200"
                  }`}
                >
                  <Truck />
                  Delivery
                </button>
              </div>
            </section>

            {fulfillment === "delivery" && (
              <section className="bg-white p-6 rounded-2xl border shadow-sm">
                <h2 className="font-bold mb-4">Delivery Address</h2>

                <div className="space-y-3">
                  {/* LOADING SKELETON */}
                  {loadingAddress && (
                    <>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl border border-slate-200 animate-pulse space-y-2"
                        >
                          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                          <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                          <div className="h-3 bg-slate-200 rounded w-full"></div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* EMPTY STATE */}
                  {!loadingAddress && addresses.length === 0 && (
                    <div className="text-center text-slate-400 py-6">
                      No addresses found.
                    </div>
                  )}

                  {/* DATA */}
                  {!loadingAddress &&
                    addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`block p-4 rounded-xl border cursor-pointer transition ${
                          selectedAddress === addr.id
                            ? "border-pink-500 bg-pink-50"
                            : "border-slate-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          className="hidden"
                          checked={selectedAddress === addr.id}
                          onChange={() => {
                            setSelectedAddress(addr.id);

                            updateSession(
                              "delivery_address",
                              `${addr.full_address}, ${addr.city}`,
                            );
                          }}
                        />

                        <div className="font-semibold flex items-center gap-2">
                          {addr.label}
                          {addr.is_default === 1 && (
                            <span className="text-xs text-pink-500">
                              (Default)
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-slate-500">
                          {addr.recipient_name} • {addr.phone_number}
                        </div>

                        <div className="text-xs text-slate-400 mt-1">
                          {addr.full_address}, {addr.city}
                        </div>
                      </label>
                    ))}
                </div>
              </section>
            )}

            {/* PAYMENT */}
            <section className="bg-white p-6 rounded-2xl border shadow-sm">
              <h2 className="font-bold mb-4">Payment Method</h2>

              <button
                onClick={() => {
                  setPayment("online");
                  updateSession("payment_method", "online");
                }}
                className={`w-full p-5 rounded-2xl border mb-3 flex items-center gap-3 ${
                  payment === "online" ? "border-pink-500 bg-pink-50" : ""
                }`}
              >
                <CreditCard />
                Online Payment
              </button>

              <button
                onClick={() => {
                  setPayment("atstore");
                  updateSession("payment_method", "pay_at_shop");
                }}
                className={`w-full p-5 rounded-2xl border flex items-center gap-3 ${
                  payment === "atstore" ? "border-pink-500 bg-pink-50" : ""
                }`}
              >
                <Banknote />
                Pay at Store
              </button>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="lg:w-96">
            <div className="bg-white p-6 rounded-2xl border shadow-md sticky top-8">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>

              {/* STORES */}
              <div className="space-y-4">
                {storeList.map((store) => (
                  <div
                    key={store.storeId}
                    className="border border-slate-100 rounded-2xl p-4"
                  >
                    {/* STORE HEADER */}
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Store size={16} />
                        <span className="font-semibold text-sm">
                          {store.storeName}
                        </span>
                      </div>

                      <span className="text-sm font-bold">
                        ${store.total.toFixed(2)}
                      </span>
                    </div>

                    {/* ITEMS */}
                    <div className="space-y-2">
                      {store.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex gap-3 border-b pb-2 text-xs text-slate-600"
                        >
                          {/* IMAGE (NEXT IMAGE) */}
                          <div className="w-10 h-10 relative rounded-lg overflow-hidden border">
                            <Image
                              src={
                                item.product_image
                                  ? item.product_image.startsWith("http") ||
                                    item.product_image.includes("amazon")
                                    ? item.product_image
                                    : `${process.env.NEXT_PUBLIC_STORAGE_URL}/storage/${item.product_image}`
                                  : "/placeholder.png"
                              }
                              alt={item.product_name}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>

                          {/* INFO */}
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium text-slate-800">
                                {item.product_name}
                              </span>

                              <span className="font-semibold text-slate-900">
                                ${item.line_total}
                              </span>
                            </div>

                            <div className="flex justify-between text-slate-500 mt-1">
                              <span>
                                {item.package_name} • ${item.unit_price}
                              </span>

                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
<div className="mt-4 space-y-2 bg-pink-50 p-4 rounded-xl">

  <div className="flex justify-between text-sm">
    <span>Subtotal</span>
    <span>${Number(session.subtotal).toFixed(2)}</span>
  </div>

  <div className="flex justify-between text-sm">
    <span>Delivery Fee</span>
    <span>
      {deliveryFee > 0
        ? `$${deliveryFee.toFixed(2)}`
        : "Free"}
    </span>
  </div>

  <div className="border-t pt-2 flex justify-between font-bold">
    <span>Total</span>
    <span className="text-pink-600">
      ${grandTotal.toFixed(2)}
    </span>
  </div>

</div>

              {/* CONFIRM */}

              {payment === "online" ? (
                <Elements stripe={stripePromise}>
                  <StripePaymentForm
                    amount={grandTotal}
                    onSuccess={confirmCheckout}
                    sessionId={sessionId}
                  />
                </Elements>
              ) : (
                <button
                  onClick={confirmCheckout}
                  className="w-full mt-6 bg-linear-to-r  from-pink-500 to-pink-600 hover:to-pink-400 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
                >
                  <Lock size={16} />
                  Confirm Order
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPageContent;
