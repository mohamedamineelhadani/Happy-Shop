import { client } from "./client";

export const contactService = {
  /** POST /api/contacts */
  send: (payload) => client.post("/contacts", payload),

  // --- admin (require a token) ---
  list: () => client.get("/contacts"),
  markRead: (id) => client.put(`/contacts/${id}/read`),
  remove: (id) => client.delete(`/contacts/${id}`),
};
