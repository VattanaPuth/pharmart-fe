import api from "@/lib/axios";

const dashboardService = {
  async getStats() {
    const res = await api.get("/admin/dashboard/stats");
    return res.data;
  },
};

export default dashboardService;