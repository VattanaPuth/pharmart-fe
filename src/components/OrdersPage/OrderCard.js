import { GrDeliver } from "react-icons/gr";
import { GiCardPickup } from "react-icons/gi";
import Link from "next/link";

const getStatusStyle = (status) => {
  const statusStyles = {
    Delivering: "bg-cyan-100 text-cyan-600",
    Declined: "bg-red-100 text-red-600",
    Ready: "bg-purple-100 text-purple-600",
    Confirmed: "bg-green-100 text-green-600",
    Completed: "bg-emerald-100 text-emerald-600",
    Pending: "bg-yellow-100 text-yellow-600",
  };

  return statusStyles[status] || "bg-gray-100 text-gray-600";
};

export default function OrderCard({ order }) {
  return (
    <Link href={`/user/orders/detail/${order.id}`}>
      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition cursor-pointer active:scale-[0.99]  mt-4 mb-4">
        {/* TOP */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <div>
            <h3 className="font-semibold text-gray-800">({order.order_id}) #{order.order_number}</h3>
            <p className="text-sm text-gray-500">{order.pharmacy}</p>
          </div>

          {/* RIGHT */}
          <div className="text-right flex flex-col items-end gap-1">
            {/* ORDER STATUS */}
            <span
              className={`${getStatusStyle(
                order.status,
              )} text-xs px-2 py-1 rounded-full`}
            >
              {order.status}
            </span>

            {/* REFUND STATUS */}
            {order.refund?.status && (
              <span
                className={`text-[11px] px-2 py-1 rounded-full font-medium
        ${
          order.refund.status === "requested"
            ? "bg-orange-100 text-orange-600"
            : order.refund.status === "approved"
              ? "bg-blue-100 text-blue-600"
              : order.refund.status === "processing"
                ? "bg-purple-100 text-purple-600"
                : order.refund.status === "refunded"
                  ? "bg-emerald-100 text-emerald-600"
                  : order.refund.status === "rejected"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
        }`}
              >
                Refund: {order.refund.status}
              </span>
            )}

            <p className="text-xs text-gray-400 mt-1">{order.date}</p>
          </div>
        </div>

        {/* ITEMS */}
        <div className="border-t border-gray-50 pt-3 mb-3">
          <p className="text-sm text-gray-700 flex flex-col">
            {order.items.map((item, index) => (
              <span key={index}>
                {item.name} <span>({item.package_name}) </span> ×{item.quantity}
                {index < order.items.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {order.items.length} items
          </p>
        </div>

        {/* BOTTOM */}
        <div className="flex justify-between items-center">
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
            {order.delivery_type === "Delivery" ? (
              <span className="flex items-center gap-1">
                <GrDeliver /> Delivery
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <GiCardPickup /> Pickup
              </span>
            )}
          </span>

          <div className="font-semibold text-gray-900">
            ${Number(order.total_price).toFixed(2)}
          </div>
        </div>

        {/* VIEW DETAILS */}
        <div className="mt-3 flex justify-end">
          <span className="text-xs text-[#f06292] font-medium hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
