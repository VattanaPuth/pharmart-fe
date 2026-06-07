// "use client";
import Image from "next/image";
import { Plus, Star } from "lucide-react";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { getStorageUrl } from "@/lib/media";
export default function ProductCard({ product }) {


  const { fetchCartCount } = useCart();
  
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const role = localStorage.getItem("role");
  

    if (role !== "CUSTOMER") {
      toast.error("You need to log in as a customer to use the cart.");
      return;
    }

    const toastId = toast.loading("Adding to cart...");
    try {
      await api.post("/customer/cart/addToCart", {
        product_id: product.id,
        package_id: product.defaultPackageId,
        quantity: 1,
      });

      await fetchCartCount();
          toast.success("Added to cart", {
      id: toastId,
    });
      
    } catch (err) {
      console.error(err?.response?.data || err.message);
        toast.error("Failed to add item to cart", {
      id: toastId,
    });
    }
  };

  return (
    <Link
      href={`/products/detail/${product.id}`}
      className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col group hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-square relative mb-4 bg-slate-50/50 rounded-xl overflow-hidden flex items-center justify-center p-6">
        <Image
          src={getStorageUrl(product.image)}
          alt={product.name}
          width={200}
          height={200}
          className="object-contain group-hover:scale-110 transition-transform duration-500"
          unoptimized
        />
      </div>

      <div className="grow">
        <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight mb-1">
          {product.name}
        </h3>

        {product?.review_count > 0 ? (
          <div className="flex items-center gap-1 text-sm text-yellow-500">
            {renderStars(product.average_rating)}
            {product.average_rating} / 5
            <span className="text-gray-400">({product.review_count})</span>
          </div>
        ) : (
          <></>
        )}

        <div className="text-xs text-gray-500 mt-1 flex gap-1">
          <>{product.storeName}</>
          {product.distance != null ? (
            <label className="text-xs text-gray-500">
              ( {product.distance} km away )
            </label>
          ) : (
            <label className="text-xs text-gray-500">
              Location unavailable
            </label>
          )}
        </div>

        <div className="text-xs text-pink-500">{product.category}</div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50">
        <div className="flex items-baseline gap-0.5">
          <span className="text-[#F06292] font-bold text-base sm:text-lg">
            ${Number(product.price ?? 0).toFixed(2)}
          </span>
          <span className="text-gray-400">/ {product.packageName}</span>
        </div>

        {product.stock_quantity > 0 ? (
          <button
            disabled={product.stock_quantity <= 0}
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            className="bg-[#F06292] hover:bg-pink-600 text-white p-1.5 sm:p-2 rounded-lg transition-colors shadow-sm shadow-pink-200"
          >
            <Plus size={18} strokeWidth={3} />
          </button>
        ) : (
          <></>
        )}
      </div>
    </Link>
  );
}

const renderStars = (rating = 0) => {
  return [1, 2, 3, 4, 5].map((i) => {
    const isFilled = i <= Math.floor(rating);
    const isHalf = i - rating <= 0.5 && i > rating;

    return (
      <Star
        key={i}
        size={18}
        className={`${
          isFilled
            ? "text-yellow-400 fill-yellow-400"
            : isHalf
              ? "text-yellow-400 fill-yellow-200"
              : "text-gray-300"
        }`}
      />
    );
  });
};
