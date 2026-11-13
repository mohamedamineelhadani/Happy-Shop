import { cn, formatPrice } from "../../lib/format";

export default function Price({ value, oldValue, size = "md", className }) {
  return (
    <span
      className={cn(
        "price",
        size === "lg" && "price--lg",
        size === "sm" && "price--sm",
        className
      )}
    >
      <span className="price__now">{formatPrice(value)}</span>
      {oldValue && Number(oldValue) > Number(value) ? (
        <span className="price__was">{formatPrice(oldValue)}</span>
      ) : null}
    </span>
  );
}
