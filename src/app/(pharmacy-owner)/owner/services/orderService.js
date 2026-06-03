import api from "@/lib/axios";
// CONFIRM ORDER
export const confirmOrder = (orderId) =>
  api.put(`/owner/orders/${orderId}/confirm`);

// READY / OUT FOR DELIVERY / READY FOR PICKUP
export const readyOrder = (orderId) =>
  api.put(`/owner/orders/${orderId}/ready`);

// COMPLETE ORDER (pharmacy side)
export const completeOrder = (orderId) =>
  api.put(`/owner/orders/${orderId}/complete`);

// DECLINE ORDER
export const declineOrder = (orderId, reason) =>
  api.put(`/owner/orders/${orderId}/decline`, { reason });