import { client, setToken, getToken } from "./client";

export const authService = {
  /** POST /api/auth/login -> { token, user } */
  login: async (credentials) => {
    const response = await client.post("/auth/login", credentials);
    if (response?.data?.token) {
      setToken(response.data.token);
    }
    return response;
  },

  /** GET /api/auth/me */
  me: () => client.get("/auth/me"),

  logout: () => setToken(null),

  token: getToken,
};
