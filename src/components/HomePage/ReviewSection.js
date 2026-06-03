import React from 'react';
import { Star, Quote } from 'lucide-react';

// 1. Scalable Testimonial Data
const REVIEWS = [
  {
    id: 1,
    rating: 5,
    text: "Fast delivery and genuine medicines. I've been ordering my monthly prescriptions through PharmaMarket for 6 months now. The pharmacies are verified and trustworthy.",
    pharmacy: "HealthPlus Pharmacy",
    user: "Sarah Johnson",
    initials: "SJ",
    time: "2 weeks ago",
    bgColor: "bg-pink-500"
  },
  {
    id: 2,
    rating: 5,
    text: "Excellent service! Found exactly what I needed at competitive prices. The search feature is intuitive and the checkout process is seamless.",
    pharmacy: "CareWell Pharmacy",
    user: "Michael Chen",
    initials: "MC",
    time: "1 month ago",
    bgColor: "bg-pink-400"
  },
  {
    id: 3,
    rating: 4,
    text: "Great platform for comparing prices across different pharmacies. Saved me both time and money. Customer support was helpful when I had questions about my order.",
    pharmacy: "MediCare Central",
    user: "Priya Patel",
    initials: "PP",
    time: "3 weeks ago",
    bgColor: "bg-pink-500"
  }
];

// 2. Sub-component: Review Card
const ReviewCard = ({ review }) => (
  <div className="min-w-[320px] md:min-w-0 flex-1 bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
    <div>
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} 
          />
        ))}
      </div>
      
      {/* Testimonial Text */}
      <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
        "{review.text}"
      </p>
    </div>

    <div className="pt-6 border-t border-slate-50">
      <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
        <Quote className="w-3 h-3 rotate-180" />
        <span>{review.pharmacy}</span>
      </div>
      
      {/* User Profile */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${review.bgColor}`}>
          {review.initials}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">{review.user}</h4>
          <p className="text-[10px] text-slate-400">{review.time}</p>
        </div>
      </div>
    </div>
  </div>
);

// 3. Main Section
export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <h2 className="text-2xl font-bold text-slate-800">What Our Customers Say</h2>
        </div>
        <p className="text-slate-400 text-sm">Trusted by thousands of satisfied customers</p>
      </div>

      <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 md:grid md:grid-cols-3 md:overflow-visible">
        {REVIEWS.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}