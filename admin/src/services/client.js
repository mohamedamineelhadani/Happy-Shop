import axios from "axios";

/**
 * Shared axios instance for the HappyShop admin app.
 *
 * In development the base URL is "/api" and Vite proxies it to the PHP backend.
 * In production set VITE_API_BASE_URL.
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const TOKEN_KEY = "happyshop.admin.token";

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

/**
 * Register a callback fired whenever the API answers 401. The auth provider
 * uses it to clear the session and bounce back to the login screen.
 */
let onUnauthorized = null;
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export const client = axios.create({
  baseURL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Attach the bearer token when one is stored.
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
    const status = error.response?.status ?? 0;

    if (status === 401 && onUnauthorized) {
      onUnauthorized();
    }

    const apiError = new Error(
      payload?.message || error.message || "Something went wrong. Please try again."
    );
    apiError.status = status;
    apiError.errors = payload?.errors ?? null;
    return Promise.reject(apiError);
  }
);
