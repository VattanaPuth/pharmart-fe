export default function RefundStats() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6 ">
      
      <div className="bg-white border rounded-xl p-4">
        <p className="text-sm text-gray-500">Pending Refunds</p>
        <p className="text-xl font-semibold text-gray-500">1</p>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <p className="text-sm text-gray-500">Refunded This Month</p>
        <p className="text-xl font-semibold text-gray-500">$5.99</p>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <p className="text-sm text-gray-500">Total Refunded</p>
        <p className="text-xl font-semibold text-gray-500">$81.95</p>
      </div>

    </div>
  );
}
