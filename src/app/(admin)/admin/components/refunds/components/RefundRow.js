export default function RefundRow({ refund, onProcess }) {
  return (
    <tr className="border-t">

      <td className="py-3 text-pink-500 ">{refund.orderId}</td>
      <td className="text-gray-500">{refund.pharmacy}</td>
      <td className="text-gray-500">{refund.customer}</td>
      <td className="text-gray-500">${refund.amount}</td>
      <td className="text-gray-500">{refund.requested}</td>

      <td>
        <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">
          Refund Pending
        </span>
      </td>

      <td>
        <button
          onClick={() => onProcess(refund)}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm"
        >
          Process Refund
        </button>
      </td>

    </tr>
  );
}
