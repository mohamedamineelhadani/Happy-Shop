import { Star } from "../../lib/icons";
import { cn } from "../../lib/format";

export default function Rating({ value = 0, count, showValue = true, className }) {
  const rounded = Math.round(Number(value) || 0);

  return (
    <span
      className={cn("rating", className)}
      title={value ? `${value} out of 5` : "No reviews yet"}
    >
      <span className="rating__stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            size={14}
            filled={index <= rounded}
            className={index <= rounded ? undefined : "rating__empty"}
          />
        ))}
      </span>
      {showValue ? (
        <span>
          {value ? Number(value).toFixed(1) : "New"}
          {count != null ? ` (${count})` : ""}
        </span>
      ) : null}
    </span>
  );
}
