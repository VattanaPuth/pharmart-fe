"use client";

const CartSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse mt-3 mb-3">

      {/* STORE BLOCK */}
      {[1, 2].map((store) => (
        <div
          key={store}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          {/* Store header */}
          <div className="p-4 border-b">
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>

          {/* Items */}
          {[1, 2].map((item) => (
            <div key={item} className="p-6 flex gap-6 items-center">
              
              {/* Image */}
              <div className="w-24 h-20 bg-gray-200 rounded-lg"></div>

              {/* Info */}
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>

                <div className="h-8 w-24 bg-gray-200 rounded mt-2"></div>
              </div>

              {/* Price */}
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CartSkeleton;