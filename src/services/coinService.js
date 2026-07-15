import { api } from "./api";

export const coinService = {
  claim: (exchangeId) => api.post("/coins/claim", { exchangeId }),
  getBalance: () => api.get("/coins/balance"),
};
