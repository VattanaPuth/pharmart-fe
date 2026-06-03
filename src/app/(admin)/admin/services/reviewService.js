
import api from "@/lib/axios";

const reviewService = {

  // 📄 GET REVIEWS (PAGINATED)
  async getReviews(page = 1) {
    const res = await api.get(`/admin/reviews?page=${page}`);
    return res.data;
  },

  // 📊 GET SUMMARY STATS
  async getRatings() {
    const res = await api.get(`/admin/reviews/summary`);
    return res.data;
  }

};

export default reviewService;