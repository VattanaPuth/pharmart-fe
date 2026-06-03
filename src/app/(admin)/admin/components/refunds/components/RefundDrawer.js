export default function RefundDrawer({
  refund,
  isOpen,
  onClose,
  onConfirm,
}) {
  if (!isOpen || !refund) return null;

  return (
    <div className="fixed inset-0 z-50 flex">

      {/* overlay */}
      <div
        className="flex-1 bg-black/30"
        onClick={onClose}
      />

      {/* drawer */}
      <div className="w-[420px] bg-white h-full shadow-xl p-6 overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">
            Process Stripe Refund
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          {refund.orderId}
        </p>

        {/* order summary */}
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <p className="font-medium text-gray-600">Order Summary</p>
          <p className="text-sm text-gray-600">
            Amoxicillin Capsules
          </p>

          <div className="flex justify-between mt-2">
            <span className="text-gray-500">Refund Total</span>
            <span className="font-semibold">${refund.amount}</span>
          </div>
        </div>

        {/* pharmacy */}
        <div className="grid grid-cols-2 gap-3 mb-4">

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Pharmacy</p>
            <p className="text-sm text-gray-500">{refund.pharmacy}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Customer</p>
            <p className="text-sm text-gray-500">{refund.customer}</p>
          </div>

        </div>

        {/* stripe info */}
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          <p className="text-xs text-blue-500 mb-1">
            STRIPE PAYMENT
          </p>

          <p className="text-sm mb-1 text-gray-500">
            Payment Intent: pi_mock_e23
          </p>

          <p className="text-sm text-gray-500">
            Amount to refund: ${refund.amount}
          </p>
        </div>

        {/* confirm */}
        <button
          onClick={onConfirm}
          className="w-full bg-green-600 text-white py-3 rounded-lg mt-4"
        >
          Confirm Stripe Refund
        </button>

        <button
          onClick={onClose}
          className="w-full border mt-2 py-3 rounded-lg"
        >
          Cancel
        </button>

      </div>

    </div>
  );
}
