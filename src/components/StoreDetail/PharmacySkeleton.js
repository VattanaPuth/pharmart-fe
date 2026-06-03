export default function PharmacySkeleton () {
  <div className="animate-pulse p-6 flex justify-between">
    <div className="flex gap-4">
      <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
      <div>
        <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>
    </div>

    <div className="flex gap-6">
      <div className="h-4 w-20 bg-gray-200 rounded" />
      <div className="h-4 w-20 bg-gray-200 rounded" />
    </div>
  </div>
};

export function CategorySkeleton ()  {
  <div className="h-12 w-40 bg-gray-200 rounded-xl animate-pulse" />
};

export function  ProductSkeleton (){
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="h-40 bg-gray-200 rounded-xl animate-pulse"
      />
    ))}
  </div>
};