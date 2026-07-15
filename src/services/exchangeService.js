import { api } from "./api";

export const exchangeService = {
  send: (data) => api.post("/exchanges", data),

  getMy: () => api.get("/exchanges/myRequest"),

  accept: (id) => api.put(`/exchanges/${id}/accept`),

  decline: (id) => api.put(`/exchanges/${id}/decline`),

  complete: (id) => api.put(`/exchanges/${id}/complete`),

  getRoom: (id) => api.get(`/exchanges/${id}/room`),

  reportNoShow: (id, data) =>
    api.post(`/exchanges/${id}/no-show`, data),
};