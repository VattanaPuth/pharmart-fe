export default function RefundHistoryTable({ refunds }) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <table className="w-full text-sm">

        <thead className="text-gray-500 text-left">
          <tr>
            <th>ORDER</th>
            <th>PHARMACY</th>
            <th>CUSTOMER</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
            <th>DATE</th>
          </tr>
        </thead>

        <tbody>

          {refunds.map((refund) => (
            <tr key={refund.id} className="border-t">

              <td className="text-pink-500 py-3">
                {refund.orderId}
              </td>

              <td>{refund.pharmacy}</td>

              <td>{refund.customer}</td>

              <td>${refund.amount}</td>

              <td>
                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                  Refunded
                </span>
              </td>

              <td>{refund.date}</td>

            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}
