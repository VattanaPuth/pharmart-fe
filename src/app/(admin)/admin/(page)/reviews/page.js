"use client";

import React, { useEffect, useState } from "react";
import reviewService from "../../services/reviewService";

import RatingSummary from "../../components/reviews/components/RatingSummary";
import RatingDistribution from "../../components/reviews/components/RatingDistribution";
import ReviewCard from "../../components/reviews/components/ReviewCard";

export default function ReviewsPage() {

  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const reviewData = await reviewService.getReviews();
        const ratingData = await reviewService.getRatings();

        setReviews(reviewData.data); // ⚠️ Laravel pagination fix
        setRatings(ratingData);

      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // loading state
  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Loading reviews...
      </div>
    );
  }

  // safety check
  if (!ratings) return null;

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="p-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Review Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {ratings.total} total reviews across all pharmacies
          </p>
        </div>

        {/* Summary */}
        <RatingSummary
          avg={ratings.average}
          total={ratings.total}
          positive={ratings.positive}
          negative={ratings.negative}
        />

        {/* Distribution */}
        <div className="mt-6">
          <RatingDistribution dist={ratings.distribution} />
        </div>

        {/* Reviews List */}
        <div className="mt-6 space-y-4">

          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews found</p>
          ) : (
            reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
              />
            ))
          )}

        </div>

      </main>
    </div>
  );
}