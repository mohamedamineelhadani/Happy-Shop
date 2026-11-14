import { client } from "./client";

export const subscriberService = {
  /** POST /api/subscribers */
  subscribe: (payload) => client.post("/subscribers", payload),

  // --- admin (require a token) ---
  list: () => client.get("/subscribers"),
  remove: (id) => client.delete(`/subscribers/${id}`),
};
