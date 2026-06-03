import { Star } from "lucide-react";

export default function ReviewCard({ review }) {

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-4">

      <div className="flex justify-between">

        {/* Pharmacy */}
        <span className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-500">
          {review.pharmacy}
        </span>

        {/* Date */}
        <span className="text-gray-500 text-sm">
          {review.date}
        </span>

      </div>

      {/* ⭐ Rating */}
      <div className="mt-2 text-gray-500">
        {"⭐".repeat(review.rating)}
      </div>

      {/* User + Order */}
      <p className="text-sm mt-1 text-gray-500">
        <b>{review.user}</b> · {review.order}
      </p>

      {/* 🆕 Product Name */}
      <p className="text-sm mt-1 text-blue-600 font-medium">
        Product: {review.product}
      </p>

      {/* Comment */}
      <p className="text-gray-600 text-sm mt-2">
        {review.comment}
      </p>

    </div>
  );
}