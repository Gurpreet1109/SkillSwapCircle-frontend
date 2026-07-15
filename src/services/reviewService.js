import { api } from "./api";

export const reviewService = {
  create: (data) => api.post("/reviews", data),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
};
