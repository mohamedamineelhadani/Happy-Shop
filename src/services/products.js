import { client } from "./client";

export const productService = {
  /** GET /api/products?category=&search=&sort=&page=&per_page= */
  list: (params = {}) => client.get("/products", { params }),

  /** GET /api/products/{slug} */
  get: (slug) => client.get(`/products/${encodeURIComponent(slug)}`),

  /** POST /api/products/{slug}/reviews */
  addReview: (slug, payload) =>
    client.post(`/products/${encodeURIComponent(slug)}/reviews`, payload),

  // --- admin (require a token) ---
  create: (payload) => client.post("/products", payload),
  update: (id, payload) => client.put(`/products/${id}`, payload),
  remove: (id) => client.delete(`/products/${id}`),
};
