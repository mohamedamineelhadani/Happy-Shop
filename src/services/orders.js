import { client } from "./client";

export const orderService = {
  /** POST /api/orders — items: [{ product_id, quantity }] */
  create: (payload) => client.post("/orders", payload),

  // --- admin (require a token) ---
  list: (params = {}) => client.get("/orders", { params }),
  get: (reference) => client.get(`/orders/${encodeURIComponent(reference)}`),
  updateStatus: (id, status) => client.put(`/orders/${id}/status`, { status }),
};
