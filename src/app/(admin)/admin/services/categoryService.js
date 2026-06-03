import api from "@/lib/axios";

const getAll = async () => {
  const res = await api.get("/admin/categories/read");

  return res.data;
};

const create = async (data) => {
  const res = await api.post("/admin/categories", data);

  return res.data.category || res.data;
};

const update = async (id, data) => {
  const res = await api.put(`/admin/categories/update/${id}`, data);

  return res.data;
};

export default {
  getAll,
  create,
  update,
};