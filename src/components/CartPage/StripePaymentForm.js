"use client";

import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import api from "@/lib/axios";

const StripePaymentForm = ({ amount, onSuccess, sessionId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  // useEffect(() => {
  //   if (!sessionId) return;

  //   const createIntent = async () => {
  //     const res = await api.post("/payment/stripe/create-intent", {
  //       amount,
  //       currency: "usd",
  //       checkout_session_id: sessionId,
  //     });

  //     setClientSecret(res.data.client_secret);
  //     setPaymentIntentId(res.data.payment_intent_id);
  //   };

  //   createIntent();
  // }, [sessionId, amount]);

const handlePay = async () => {
  try {
    setLoading(true);
    setError(null);

    // =========================
    // CREATE PAYMENT INTENT
    // =========================
    const confirmRes = await api.post(
      `/customer/checkout/session/${sessionId}/confirm`
    );

    const clientSecret = confirmRes.data.client_secret;

    if (!clientSecret) {
      throw new Error("Missing client secret");
    }

    // =========================
    // STRIPE CONFIRM CARD
    // =========================
    const cardElement = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: "Customer",
        },
      },
    });

    console.log("STRIPE RESULT:", result);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    // =========================
    // PAYMENT SUCCESS
    // =========================
    if (result.paymentIntent.status === "succeeded") {

      // webhook creates orders automatically

      await onSuccess();
    }

  } catch (err) {

    console.error(err);

    setError(
      err?.response?.data?.message ||
      err.message ||
      "Payment failed"
    );

  } finally {
    setLoading(false);
  }
};

// const handlePay = async () => {
//   try {
//     setLoading(true);
//     setError(null);

//     const cardElement = elements.getElement(CardElement);

//     const result = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: cardElement,
//         billing_details: {
//           name: "Customer",
//         },
//       },
//     });

//     if (result.error) {
//       setError(result.error.message);
//       return;
//     }

//     if (result.paymentIntent.status === "succeeded") {
//       // DO NOT call backend confirm
//       await onSuccess(); // just redirect
//     }

//   } catch (err) {
//     setError(err?.message || "Payment failed");
//   } finally {
//     setLoading(false);
//   }
// };
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-xl bg-white">
        <CardElement
          options={{
            hidePostalCode: true,
          }}
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        onClick={handlePay}
        disabled={!stripe || loading}
        className="w-full bg-pink-500 text-white py-3 rounded-xl"
      >
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>
    </div>
  );
};

export default StripePaymentForm;
