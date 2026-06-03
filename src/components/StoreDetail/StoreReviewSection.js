import { Star } from "lucide-react";

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

export default function ReviewSection({reviews}) {
  return (
    <section className="bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-2xl font-bold text-slate-800">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-700">{review.name}</h3>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  {review.comment}
                </p>
              </div>
              <span className="mt-4 text-xs font-medium text-slate-400">
                {review.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}