export default function RatingDistribution({dist}){

  const max = Math.max(...Object.values(dist));

  return(

   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 w-full">
  <h2 className="text-lg font-semibold text-gray-800 mb-4">
    Rating Distribution
  </h2>

  {[5, 4, 3, 2, 1].map((star) => (
    <div key={star} className="flex items-center gap-3 mb-3 w-full">

      {/* Stars */}
      <div className="w-20 text-yellow-400 text-sm shrink-0">
        {"★".repeat(star)}
        <span className="text-gray-300">
          {"★".repeat(5 - star)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
          style={{
            width: `${(dist[star] / max) * 100}%`,
          }}
        />
      </div>

      {/* Count */}
      <div className="w-8 text-right text-sm text-gray-600 shrink-0">
        {dist[star]}
      </div>
    </div>
  ))}
</div>
  )
}
