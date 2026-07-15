import { api } from "./api";

export const skillService = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/skills${q ? "?" + q : ""}`);
  },
  getMy: () => api.get("/skills/my"),
  create: (data) => api.post("/skills/createSkill", data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};
