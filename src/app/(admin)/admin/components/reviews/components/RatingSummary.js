export default function RatingSummary({avg,total,positive,negative}){

  return(

    <div className="grid grid-cols-4 gap-4 mb-6">

      <div className="bg-white p-4 rounded-xl shadow">
        ⭐ <b className="text-gray-500">{avg}</b>
        <p className="text-sm text-gray-500">Platform Avg Rating</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <b className="text-gray-500">{total}</b>
        <p className="text-sm text-gray-500">Total Reviews</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <b className="text-gray-500">{positive}</b>
        <p className="text-sm text-gray-500">Positive (4-5★)</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <b className="text-gray-500">{negative}</b>
        <p className="text-sm text-gray-500">Negative (1-2★)</p>
      </div>

    </div>

  )
}
