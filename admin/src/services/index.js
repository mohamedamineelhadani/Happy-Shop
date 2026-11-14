import { client, getToken, setToken } from "./client";

export { client, getToken, setToken } from "./client";

/** Authentication + current admin. */
export const authService = {
  /** POST /api/auth/login -> { token, user } */
  async login(credentials) {
    const response = await client.post("/auth/login", credentials);
    if (response?.data?.token) setToken(response.data.token);
    return response;
  },
  /** GET /api/auth/me */
  me: () => client.get("/auth/me"),
  /** PUT /api/auth/profile — update the signed-in admin's name/email/password. */
  updateProfile: (payload) => client.put("/auth/profile", payload),
  logout: () => setToken(null),
  token: getToken,
};

/** Dashboard totals, order breakdown and low-stock list. */
export const statsService = {
  /** GET /api/admin/stats */
  overview: () => client.get("/admin/stats"),
};

/** Products (admin CRUD + full listing). */
export const productService = {
  /** GET /api/admin/products — every status */
  list: (params = {}) => client.get("/admin/products", { params }),
  /** GET /api/products/{slug-or-id} */
  get: (key) => client.get(`/products/${encodeURIComponent(key)}`),
  create: (payload) => client.post("/products", payload),
  update: (id, payload) => client.put(`/products/${id}`, payload),
  remove: (id) => client.delete(`/products/${id}`),
};

/** Categories. */
export const categoryService = {
  /** GET /api/categories */
  list: () => client.get("/categories"),
  create: (payload) => client.post("/categories", payload),
  update: (id, payload) => client.put(`/categories/${id}`, payload),
  remove: (id) => client.delete(`/categories/${id}`),
};

/** Orders. */
export const orderService = {
  list: (params = {}) => client.get("/orders", { params }),
  get: (reference) => client.get(`/orders/${encodeURIComponent(reference)}`),
  update: (id, payload) => client.put(`/orders/${id}`, payload),
  updateStatus: (id, status) => client.put(`/orders/${id}/status`, { status }),
};

/** Contact messages. */
export const contactService = {
  list: () => client.get("/contacts"),
  markRead: (id) => client.put(`/contacts/${id}/read`),
  remove: (id) => client.delete(`/contacts/${id}`),
};

/** Newsletter subscribers. */
export const subscriberService = {
  list: () => client.get("/subscribers"),
  update: (id, payload) => client.put(`/subscribers/${id}`, payload),
  remove: (id) => client.delete(`/subscribers/${id}`),
};

/** Image uploads (multipart). */
export const uploadService = {
  /**
   * POST /api/admin/uploads -> { url, filename, size, mime }
   * @param {File} file
   * @param {(percent:number)=>void} [onProgress]
   */
  image: (file, onProgress) => {
    const form = new FormData();
    form.append("image", file);
    return client.post("/admin/uploads", form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    });
  },
};
