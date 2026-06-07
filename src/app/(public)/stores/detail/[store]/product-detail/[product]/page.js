"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Store,
  Minus,
  Plus,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Thermometer,
  Info,
  AlertTriangle,
  Check,
  Star,
} from "lucide-react";
import { SignInModal } from "@/components/SignInModal";
import { useAuth } from "@/context/AuthContext";
import BottomDetail from "@/components/ProductDetail/BottomDetail";
import PackageSelection from "@/components/ProductDetail/PackageSelection";
import QuantityInput from "@/components/ProductDetail/QuantityInput";
import { BiRightArrow } from "react-icons/bi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { getStorageUrl } from "@/lib/media";


export default function ProductDetail() {
  const MAX_QTY = 10;
  const { user, loading: authLoading } = useAuth();
  const isGuest = !user;

  const params = useParams();
  const productId = params.product;

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [clickedAddToCart, setClikedAddToCart] = useState(false);

  const [quantityInput, setQuantityInput] = useState("1");

  const role = user?.role || "guest";

  const [adding, setAdding] = useState(false);
  const router = useRouter();

  const { fetchCartCount } = useCart();
  // ---------------- FETCH PRODUCT ----------------
  useEffect(() => {
    if (!productId) return;

    let ignore = false;

    const fetchProduct = async () => {
      try {
        setLoadingProduct(true);

        const res = await api.get(`/public/products/${productId}`);

        if (ignore) return;

        const data = res.data.data;

        setProduct(data);
        setSelectedPackage(data.default_package || data.packages?.[0] || null);
      } catch (err) {
        console.error(err);
      } finally {
        if (!ignore) setLoadingProduct(false);
      }
    };

    fetchProduct();

    return () => {
      ignore = true;
    };
  }, [productId]);

  const updateQuantity = (val) => {
    const stock = selectedPackage?.stock_quantity || 0;

    const safe = Math.max(1, Math.min(val, MAX_QTY, stock));

    setQuantity(safe);
    setQuantityInput(String(safe));
  };

  useEffect(() => {
    if (!selectedPackage) return;

    const stock = selectedPackage.stock_quantity || 0;

    if (quantity > stock) {
      updateQuantity(stock || 1);
    }
  }, [selectedPackage]);

  // ---------------- TOTAL ----------------
  const total = selectedPackage
    ? (Number(selectedPackage.price) * quantity).toFixed(2)
    : "0.00";

  // ---------------- HANDLERS ----------------
  const handleAddToCart = async () => {
    if (authLoading || adding) return;

    if (isGuest) {
      setShowModal(true);
      return;
    }

    if (!selectedPackage) return;

    if (quantity > MAX_QTY) {
      //alert("Maximum order quantity is 10");
        toast.error("Maximum order quantity is 10");
      return;
    }

    if (quantity > selectedPackage.stock_quantity) {
     // alert("Not enough stock available");
     toast.error("Not enough stock available");
      
      return;
    }

    try {
      setAdding(true);

      await api.post("/customer/cart/addToCart", {
        product_id: productId,
        package_id: selectedPackage.id,
        quantity,
      });

      setClikedAddToCart(true);
      await fetchCartCount();
      toast.success("Add to cart successful");

      setTimeout(() => {
        setClikedAddToCart(false);
      }, 2000);


    } catch (err) {
      //alert(err?.response?.data?.message || "Failed to add to cart");
       toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = () => {
    if (role === "guest") {
      setShowModal(true);
    } else {
      console.log("buy now");
    }
  };

  // ---------------- SKELETON ----------------
  if (authLoading || loadingProduct) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }
  if (!product) return <div className="p-10">Product not found</div>;

  return (
    <main className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* Navigation Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-slate-400">
        <button
          onClick={() => router.back()}
          className="flex items-center hover:text-pink-500"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <span>/</span>
        <span className="text-slate-600">{product.category}</span>
      </nav>

      <section className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
        {/* LEFT: IMAGE (UNCHANGED STYLE) */}
        <div className="bg-white rounded-[32px] flex items-center justify-center aspect-square border border-slate-100">
          <div className="relative w-full h-full">
            <Image
              src={getStorageUrl(product.image)}
              alt={product.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>

        {/* RIGHT: INFO */}
        <div className="flex flex-col">
          {/* Status Badge */}
          {/* <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1 rounded-full w-fit mb-4">
            <Clock size={14} />
            <span className="text-xs font-bold">Near Expiry</span>
          </div> */}

          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            {product.name}
          </h1>

          <p className="text-slate-400 mb-8 font-medium">
            Generic: {product.generic_name}
          </p>

          {product?.review_count > 0 ? (
            <div className="flex items-center gap-2 mb-6">
              {/* ⭐ Stars */}
              <div className="flex items-center">
                {renderStars(product.average_rating)}
              </div>

              {/* ⭐ Rating number */}
              <span className="text-sm font-semibold text-slate-700">
                {product.average_rating}
              </span>

              {/* 🧾 Count */}
              <span className="text-sm text-gray-400">
                ({product.review_count} reviews)
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-400 mb-6">No reviews yet</span>
          )}

          {/* META GRID (UNCHANGED STYLE) */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                Strength
              </p>
              <p className="text-slate-700 font-semibold">{product.strength}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                Form
              </p>
              <p className="text-slate-700 font-semibold">{product.form}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                Category
              </p>
              <p className="text-slate-700 font-semibold">{product.category}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
                Expiry
              </p>
              <p className="text-slate-700 font-semibold">
                {new Date(product.expiry_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* PHARMACY CARD (UNCHANGED STYLE) */}
          <Link href={`/stores/detail/${product.owner_id}`} className="block">
            <div className="bg-slate-50/60 hover:bg-slate-100/70 border border-slate-100 rounded-2xl p-4 flex items-center justify-between transition-all duration-200 mb-8 shadow-sm hover:shadow-md">
              {/* Left side */}
              <div className="flex items-center gap-4">
                <div className="bg-[#FCE4EC] p-3 rounded-xl text-[#F06292]">
                  <Store size={20} />
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    {product.pharmacy}

                    {/* DISTANCE (HIDDEN FOR GUEST) */}
                    {product.distance_km != null && (
                      <p className="text-xs text-slate-500 mb-4">
                        {product.distance_km} km away
                      </p>
                    )}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Tap to view pharmacy details
                  </p>
                </div>
              </div>

              {/* Right arrow */}
              <div className="text-slate-400">
                <BiRightArrow size={24} />
              </div>
            </div>
          </Link>

          {/* PACKAGES */}
          <PackageSelection
            product={product}
            selectedPackage={selectedPackage}
            setSelectedPackage={setSelectedPackage}
          />

          {selectedPackage?.stock_quantity <= 0 && (
            <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
              <AlertTriangle size={16} />
              Out of stock
            </div>
          )}

          {/* QUANTITY */}
          <QuantityInput
            quantityInput={quantityInput}
            quantity={quantity}
            setQuantity={setQuantity}
            total={total}
            setQuantityInput={setQuantityInput}
            updateQuantity={updateQuantity}
            selectedPackage={selectedPackage}
          />

          {/* ACTIONS (UNCHANGED STYLE) */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={
                adding ||
                !selectedPackage ||
                selectedPackage.stock_quantity <= 0
              }
              className={`flex-1 border-2 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition ${
                clickedAddToCart
                  ? "bg-[#00C950] border-green-500 text-white"
                  : "border-[#F06292] text-[#F06292]"
              } ${adding ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {clickedAddToCart ? (
                <>
                  <Check size={20} /> Added
                </>
              ) : (
                <>
                  <ShoppingCart size={20} /> Add to Cart
                </>
              )}
            </button>

            <button
              disabled={!selectedPackage || selectedPackage.stock_quantity <= 0}
              onClick={handleBuyNow}
              className={`flex-1 font-bold py-4 rounded-2xl ${
                !selectedPackage || selectedPackage.stock_quantity <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#F06292] text-white"
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </section>

      {/* DESCRIPTION (UNCHANGED STYLE) */}
      <section className="bg-white border border-slate-100 rounded-[24px] p-6 mx-auto shadow-sm max-w-7xl mt-9">
        <h2 className="font-bold text-slate-800 mb-2">Product Description</h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          {product.description}
        </p>
      </section>

      {/* STORAGE (UNCHANGED STYLE) */}
      <BottomDetail />

      <SignInModal isOpen={showModal} onOpenChange={setShowModal} />

      {/* {product.reviews.map((r, i) => (
        <div
          key={`${r.id || i}`}
          className="flex gap-3 py-4 px-4 border-b border-gray-100"
        >
        
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
            {r.customer_name?.charAt(0) || "U"}
          </div>

      
          <div className="flex-1">
         
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-gray-800">
                {r.customer_name || "Anonymous"}
              </span>

              <div className="flex items-center">
                {renderStars(product.average_rating)}
              </div>

            
              {r.created_at && (
                <span className="text-gray-400 text-xs">
                  • {new Date(r.created_at).toLocaleDateString()}
                </span>
              )}
            </div>

         
            <p className="text-sm text-gray-700 mt-1 leading-relaxed">
              {r.review}
            </p>
          </div>
        </div>
      ))} */}
    </main>
  );
}

/* ---------------- SKELETON (kept same style) ---------------- */
const Skeleton = () => (
  <div className="max-w-7xl p-4 grid lg:grid-cols-2 gap-12 animate-pulse">
    <div className="aspect-square bg-slate-200 rounded-[32px]" />
    <div className="space-y-4">
      <div className="h-6 bg-slate-200 rounded w-1/2" />
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="h-24 bg-slate-200 rounded" />
      <div className="h-12 bg-slate-200 rounded" />
    </div>
  </div>
);

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
