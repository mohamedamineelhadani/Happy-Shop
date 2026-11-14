/* Small, dependency-free formatting helpers. */

const priceFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** 1290 -> "1,290 MAD" */
export function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return `${priceFormatter.format(amount)} MAD`;
}

/** Just the number, without the currency suffix. */
export function formatAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "0";
  return priceFormatter.format(amount);
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(String(value).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "—";
  return dateTimeFormatter.format(date);
}

export function titleCase(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function truncate(text, max = 120) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

/** Join truthy class names. */
export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export const PRODUCT_STATUSES = ["active", "draft", "archived"];
