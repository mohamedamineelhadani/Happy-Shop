import { client } from "./client";

export const categoryService = {
  /** GET /api/categories */
  list: () => client.get("/categories"),

  /** GET /api/categories/{slug} */
  get: (slug) => client.get(`/categories/${encodeURIComponent(slug)}`),

  // --- admin (require a token) ---
  create: (payload) => client.post("/categories", payload),
  update: (id, payload) => client.put(`/categories/${id}`, payload),
  remove: (id) => client.delete(`/categories/${id}`),
};
