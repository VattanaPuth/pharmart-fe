import React from "react";
import { Truck, Store } from "lucide-react";

const normalizeType = (type) => {
  if (!type) return "";

  const map = {
    delivery: "Delivery",
    pickup: "Pickup",
    "pick-up": "Pickup",
  };

  return map[type.toLowerCase()] || type;
};

const FulfillmentDetail = ({ orderFulfillment }) => {
  if (!orderFulfillment) return null;

  const {
    type,
    address,
    courier,
    trackingId,
    storeAddress,
    openHour,
    closeHour,
  } = orderFulfillment;

  const normalizedType = normalizeType(type);

  return (
    <>
      <h3 className="text-sm font-bold mb-4 text-gray-600">
        Fulfillment Details
      </h3>

      <div className="flex gap-4">
        {/* Icon */}
        <div className="p-2 bg-pink-50 rounded-lg h-fit">
          {normalizedType === "Delivery" ? (
            <Truck className="text-[#f06292]" size={20} />
          ) : (
            <Store className="text-[#f06292]" size={20} />
          )}
        </div>

        {/* Content */}
        <div className="text-sm space-y-1">
          <p className="font-bold text-gray-700">
            {normalizedType}
          </p>

          {normalizedType === "Delivery" ? (
            <>
              {address && (
                <p className="text-gray-500">
                  <span className="font-medium text-gray-600">
                    Customer address:
                  </span>{" "}
                  {address}
                </p>
              )}

              {courier && (
                <p className="text-gray-500">
                  <span className="font-medium text-gray-600">
                    Courier:
                  </span>{" "}
                  {courier}
                </p>
              )}

              {trackingId && (
                <p className="text-gray-500">
                  <span className="font-medium text-gray-600">
                    Tracking ID:
                  </span>{" "}
                  {trackingId}
                </p>
              )}
            </>
          ) : (
            <>
              {storeAddress && (
                <p className="text-gray-500">
                  <span className="font-medium text-gray-600">
                    Store address:
                  </span>{" "}
                  {storeAddress}
                </p>
              )}

              {(openHour || closeHour) && (
                <p className="text-gray-500">
                  <span className="font-medium text-gray-600">
                    Work hour:
                  </span>{" "}
                  {openHour || "--"} - {closeHour || "--"}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FulfillmentDetail;