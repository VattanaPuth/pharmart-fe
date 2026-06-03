import RefundRow from "./RefundRow";

export default function RefundTable({ refunds, onProcess }) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <table className="w-full text-sm">

        <thead className="text-gray-500 text-left">
          <tr>
            <th>ORDER</th>
            <th>PHARMACY</th>
            <th>CUSTOMER</th>
            <th>AMOUNT</th>
            <th>REQUESTED</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>

        <tbody>
          {refunds.map((refund) => (
            <RefundRow
              key={refund.id}
              refund={refund}
              onProcess={onProcess}
            />
          ))}
        </tbody>

      </table>
    </div>
  );
}
