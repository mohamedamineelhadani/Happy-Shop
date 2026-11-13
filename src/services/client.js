import axios from "axios";

/**
 * Shared axios instance for the HappyShop API.
 *
 * In development the base URL is "/api" and Vite proxies it to the PHP backend,
 * so there is never a CORS problem. In production set VITE_API_BASE_URL.
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const TOKEN_KEY = "happyshop.token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable — ignore */
  }
}

export const client = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach the bearer token when one is stored (used by the admin area).
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap the { success, message, data } envelope and normalise errors.
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const payload = error.response?.data;
    const apiError = new Error(
      payload?.message || error.message || "Something went wrong. Please try again."
    );
    apiError.status = error.response?.status ?? 0;
    apiError.errors = payload?.errors ?? null;
    return Promise.reject(apiError);
  }
);
