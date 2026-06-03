// services/pharmacyService.js
import api from "@/lib/axios";

class PharmacyService {

  // ----------------------------------------
  // GET PHARMACIES
  // ----------------------------------------
async getPharmacies(status = "all", search = "", page = 1) {
  const params = {};

  if (status !== "all") params.status = status;
  if (search) params.search = search;
  if (page) params.page = page; // ✅ ADD THIS

  const res = await api.get("/admin/pharmacies", { params });

  return res.data;
}

  // ----------------------------------------
  // GET COUNTS
  // ----------------------------------------
  async getStatusCounts() {
    const res = await api.get("/admin/pharmacies/counts");
    return res.data;
  }

  // ----------------------------------------
  // UPDATE STATUS (APPROVE / REJECT / SUSPEND)
  // ----------------------------------------
async updatePharmacyStatus(pharmacyId, status, message) {
  const res = await api.put(
    `/admin/pharmacies/${pharmacyId}/status`,
    {
      status,
      message, // ✅ THIS WAS MISSING
    }
  );

  return res.data;
}

  // ----------------------------------------
  // OPTIONAL: UI HELPERS (KEEP)
  // ----------------------------------------
  getEKYCStatus(matchScore) {
    if (matchScore >= 90) {
      return {
        level: "high",
        text: "match",
        badgeColor: "bg-green-100 text-green-700",
        bg: "bg-green-50",
      };
    }

    if (matchScore >= 70) {
      return {
        level: "medium",
        text: "needs review",
        badgeColor: "bg-yellow-100 text-yellow-700",
        bg: "bg-yellow-50",
      };
    }

    return {
      level: "low",
      text: "not match",
      badgeColor: "bg-red-100 text-red-700",
      bg: "bg-red-50",
    };
  }

  getStatusBadge(status) {
    const map = {
      approved: {
        label: "Approved",
        color: "bg-green-100 text-green-700",
      },
      pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-700",
      },
      rejected: {
        label: "Rejected",
        color: "bg-red-100 text-red-700",
      },
      suspended: {
        label: "Suspended",
        color: "bg-gray-100 text-gray-700",
      },
    };

    return map[status] || map.pending;
  }
}

export const pharmacyService = new PharmacyService();